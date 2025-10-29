const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize SQLite database
const db = new sqlite3.Database('./highlights.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_title TEXT NOT NULL,
      author TEXT,
      highlight_text TEXT NOT NULL,
      location TEXT,
      page INTEGER,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_reviewed DATETIME,
      next_review DATETIME,
      review_count INTEGER DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      interval_days INTEGER DEFAULT 1
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Database initialized');
    }
  });
}

// Parse Kindle HTML highlights file
function parseKindleHTML(html) {
  const $ = cheerio.load(html);
  const highlights = [];

  $('.noteHeading').each((i, elem) => {
    const heading = $(elem).text();
    const content = $(elem).next('.noteText').text().trim();

    // Extract book title and author from heading
    const titleMatch = heading.match(/^(.+?)\s*\(/);
    const authorMatch = heading.match(/\(([^)]+)\)/);
    const locationMatch = heading.match(/Location\s+(\d+)/i) || heading.match(/Page\s+(\d+)/i);

    if (content) {
      highlights.push({
        book_title: titleMatch ? titleMatch[1].trim() : 'Unknown',
        author: authorMatch ? authorMatch[1].trim() : '',
        highlight_text: content,
        location: locationMatch ? locationMatch[0] : '',
        page: locationMatch ? parseInt(locationMatch[1]) : null
      });
    }
  });

  // Fallback parser for different HTML formats
  if (highlights.length === 0) {
    $('.bodyContainer .sectionHeading, .bookMain').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 10) {
        highlights.push({
          book_title: 'Imported Book',
          author: '',
          highlight_text: text,
          location: '',
          page: null
        });
      }
    });
  }

  return highlights;
}

// Calculate next review date using simple spaced repetition
function calculateNextReview(reviewCount, easeFactor, intervalDays) {
  let newInterval;

  if (reviewCount === 0) {
    newInterval = 1;
  } else if (reviewCount === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(intervalDays * easeFactor);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    nextReview: nextReview.toISOString(),
    interval: newInterval
  };
}

// API Routes

// Upload highlights file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }

    const highlights = parseKindleHTML(data);

    if (highlights.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'No highlights found in file' });
    }

    let inserted = 0;
    const stmt = db.prepare(`
      INSERT INTO highlights (book_title, author, highlight_text, location, page, next_review)
      VALUES (?, ?, ?, ?, ?, datetime('now', '+1 day'))
    `);

    highlights.forEach(h => {
      stmt.run(h.book_title, h.author, h.highlight_text, h.location, h.page, (err) => {
        if (err) {
          console.error('Error inserting highlight:', err);
        } else {
          inserted++;
        }
      });
    });

    stmt.finalize(() => {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: `Imported ${inserted} highlights`,
        count: inserted
      });
    });
  });
});

// Get all highlights
app.get('/api/highlights', (req, res) => {
  db.all('SELECT * FROM highlights ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get highlights due for review
app.get('/api/highlights/review', (req, res) => {
  db.all(
    `SELECT * FROM highlights
     WHERE next_review IS NULL OR date(next_review) <= date('now')
     ORDER BY next_review ASC, created_at DESC
     LIMIT 10`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Mark highlight as reviewed
app.post('/api/highlights/:id/review', (req, res) => {
  const { id } = req.params;
  const { rating } = req.body; // rating: 'easy', 'good', 'hard'

  // Get current highlight data
  db.get('SELECT * FROM highlights WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Highlight not found' });
    }

    let newReviewCount = row.review_count + 1;
    let newEaseFactor = row.ease_factor;
    let newIntervalDays = row.interval_days;

    // Adjust ease factor based on rating
    if (rating === 'easy') {
      newEaseFactor = Math.min(newEaseFactor + 0.15, 3.0);
    } else if (rating === 'hard') {
      newEaseFactor = Math.max(newEaseFactor - 0.2, 1.3);
      newIntervalDays = Math.max(1, Math.floor(newIntervalDays * 0.5));
    }

    const { nextReview, interval } = calculateNextReview(
      newReviewCount,
      newEaseFactor,
      newIntervalDays
    );

    db.run(
      `UPDATE highlights
       SET last_reviewed = datetime('now'),
           next_review = ?,
           review_count = ?,
           ease_factor = ?,
           interval_days = ?
       WHERE id = ?`,
      [nextReview, newReviewCount, newEaseFactor, interval, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          success: true,
          nextReview: nextReview,
          intervalDays: interval
        });
      }
    );
  });
});

// Add manual highlight
app.post('/api/highlights', (req, res) => {
  const { book_title, author, highlight_text, note } = req.body;

  if (!book_title || !highlight_text) {
    return res.status(400).json({ error: 'Book title and highlight text are required' });
  }

  db.run(
    `INSERT INTO highlights (book_title, author, highlight_text, note, next_review)
     VALUES (?, ?, ?, ?, datetime('now', '+1 day'))`,
    [book_title, author || '', highlight_text, note || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Get stats
app.get('/api/stats', (req, res) => {
  db.get(
    `SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN date(next_review) <= date('now') THEN 1 END) as due_for_review,
      COUNT(CASE WHEN review_count > 0 THEN 1 END) as reviewed
     FROM highlights`,
    [],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    }
  );
});

// Delete highlight
app.delete('/api/highlights/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM highlights WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Highlight not found' });
    }
    res.json({ success: true });
  });
});

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
