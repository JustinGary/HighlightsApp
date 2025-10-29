# HighlightsApp
Read Kindle Highlights and surface them using spaced repetition

## MVP Features

This is the simplest working version of the Intelligent Highlights Management Application. It includes:

- Upload Kindle highlights (HTML export format)
- Add manual notes and highlights
- View all highlights in a library
- Review highlights with spaced repetition
- Track review statistics
- Simple spaced repetition algorithm (SM-2 variant)

## Quick Start

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will start at http://localhost:3000

## How to Use

### 1. Export Kindle Highlights

1. Go to [read.amazon.com/notebook](https://read.amazon.com/notebook)
2. Select a book and view your highlights
3. Use your browser's "Save Page As" feature to save the HTML file
4. Upload the saved file using the "Upload" tab in the app

### 2. Review Highlights

- Click the "Review" tab to see highlights due for review
- Rate each highlight as "Hard", "Good", or "Easy"
- The algorithm will schedule the next review based on your rating:
  - Easy: Longer interval
  - Good: Standard interval
  - Hard: Shorter interval

### 3. Add Manual Notes

- Use the "Add Note" tab to manually add highlights from any source
- Fill in the book title, author, and your note/highlight

### 4. Browse Library

- View all your highlights in the "Library" tab
- See when each highlight is due for review
- Delete highlights you no longer want

## Technology Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript (HTML/CSS/JS)
- **Database**: SQLite
- **File Upload**: Multer
- **HTML Parsing**: Cheerio

## Database Schema

The application uses a single `highlights` table with the following fields:

- `id`: Primary key
- `book_title`: Title of the book/source
- `author`: Author name
- `highlight_text`: The actual highlight content
- `location`: Kindle location or page reference
- `note`: Additional notes
- `created_at`: When the highlight was added
- `last_reviewed`: Last review timestamp
- `next_review`: Scheduled next review date
- `review_count`: Number of times reviewed
- `ease_factor`: Spaced repetition ease factor (SM-2)
- `interval_days`: Current interval between reviews

## API Endpoints

- `POST /api/upload` - Upload Kindle highlights file
- `GET /api/highlights` - Get all highlights
- `GET /api/highlights/review` - Get highlights due for review
- `POST /api/highlights/:id/review` - Mark highlight as reviewed
- `POST /api/highlights` - Add manual highlight
- `GET /api/stats` - Get statistics
- `DELETE /api/highlights/:id` - Delete a highlight

## Future Enhancements

See [PRD.md](./PRD.md) for the full product roadmap including:

- Email digest functionality
- Advanced tagging and organization
- Analytics dashboard
- Browser extension
- Mobile app
- API integrations
