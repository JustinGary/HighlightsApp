// Global state
let currentReviewQueue = [];
let currentReviewIndex = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeUploadForm();
    initializeAddForm();
    loadStats();
    loadLibrary();
    loadReviewQueue();

    // File input display
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    fileInput.addEventListener('change', (e) => {
        fileName.textContent = e.target.files[0]?.name || 'No file selected';
    });
});

// Tab navigation
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const views = document.querySelectorAll('.view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const viewName = tab.dataset.view;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active view
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`${viewName}-view`).classList.add('active');

            // Load data for specific views
            if (viewName === 'library') {
                loadLibrary();
            } else if (viewName === 'review') {
                loadReviewQueue();
            }
        });
    });
}

// Upload form handling
function initializeUploadForm() {
    const form = document.getElementById('upload-form');
    const resultDiv = document.getElementById('upload-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];

        if (!file) {
            showMessage(resultDiv, 'Please select a file', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(resultDiv, data.message, 'success');
                form.reset();
                document.getElementById('file-name').textContent = 'No file selected';
                loadStats();
                setTimeout(() => {
                    resultDiv.style.display = 'none';
                }, 5000);
            } else {
                showMessage(resultDiv, data.error || 'Upload failed', 'error');
            }
        } catch (error) {
            showMessage(resultDiv, 'Network error: ' + error.message, 'error');
        }
    });
}

// Add manual note form
function initializeAddForm() {
    const form = document.getElementById('add-form');
    const resultDiv = document.getElementById('add-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            book_title: document.getElementById('book-title').value,
            author: document.getElementById('author').value,
            highlight_text: document.getElementById('highlight-text').value,
            note: document.getElementById('note').value
        };

        try {
            const response = await fetch('/api/highlights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(resultDiv, 'Highlight added successfully!', 'success');
                form.reset();
                loadStats();
                setTimeout(() => {
                    resultDiv.style.display = 'none';
                }, 3000);
            } else {
                showMessage(resultDiv, result.error || 'Failed to add highlight', 'error');
            }
        } catch (error) {
            showMessage(resultDiv, 'Network error: ' + error.message, 'error');
        }
    });
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        document.getElementById('total-count').textContent = stats.total || 0;
        document.getElementById('due-count').textContent = stats.due_for_review || 0;
        document.getElementById('reviewed-count').textContent = stats.reviewed || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load library
async function loadLibrary() {
    try {
        const response = await fetch('/api/highlights');
        const highlights = await response.json();

        const container = document.getElementById('highlights-list');
        const emptyState = document.getElementById('no-highlights');

        if (highlights.length === 0) {
            emptyState.style.display = 'block';
            container.innerHTML = '';
        } else {
            emptyState.style.display = 'none';
            container.innerHTML = highlights.map(h => `
                <div class="highlight-item">
                    <button class="delete-btn" onclick="deleteHighlight(${h.id})">Delete</button>
                    <div class="book-info">
                        <h3>${escapeHtml(h.book_title)}</h3>
                        ${h.author ? `<p class="author">${escapeHtml(h.author)}</p>` : ''}
                    </div>
                    <div class="highlight-text">${escapeHtml(h.highlight_text)}</div>
                    ${h.note ? `<p><strong>Note:</strong> ${escapeHtml(h.note)}</p>` : ''}
                    <div class="location-info">
                        ${h.location ? `${h.location} | ` : ''}
                        Added: ${formatDate(h.created_at)}
                        ${h.review_count > 0 ? ` | Reviewed ${h.review_count} times` : ''}
                        ${h.next_review ? ` | Next review: ${formatDate(h.next_review)}` : ''}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading library:', error);
    }
}

// Load review queue
async function loadReviewQueue() {
    try {
        const response = await fetch('/api/highlights/review');
        currentReviewQueue = await response.json();
        currentReviewIndex = 0;

        displayCurrentReview();
    } catch (error) {
        console.error('Error loading review queue:', error);
    }
}

// Display current review
function displayCurrentReview() {
    const noReviews = document.getElementById('no-reviews');
    const reviewCard = document.getElementById('review-card');

    if (currentReviewQueue.length === 0 || currentReviewIndex >= currentReviewQueue.length) {
        noReviews.style.display = 'block';
        reviewCard.style.display = 'none';
        return;
    }

    noReviews.style.display = 'none';
    reviewCard.style.display = 'block';

    const highlight = currentReviewQueue[currentReviewIndex];

    document.getElementById('review-book-title').textContent = highlight.book_title;
    document.getElementById('review-author').textContent = highlight.author || '';
    document.getElementById('review-text').textContent = highlight.highlight_text;
    document.getElementById('review-meta').textContent =
        `${currentReviewIndex + 1} of ${currentReviewQueue.length} | ${highlight.location || 'No location'} | Reviewed ${highlight.review_count} times`;

    // Add event listeners to review buttons
    const buttons = reviewCard.querySelectorAll('.review-actions .btn');
    buttons.forEach(btn => {
        btn.onclick = () => reviewHighlight(highlight.id, btn.dataset.rating);
    });
}

// Review a highlight
async function reviewHighlight(id, rating) {
    try {
        const response = await fetch(`/api/highlights/${id}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating })
        });

        if (response.ok) {
            const result = await response.json();

            // Show feedback
            const reviewCard = document.getElementById('review-card');
            const feedback = document.createElement('div');
            feedback.className = 'review-info';
            feedback.innerHTML = `<strong>Next review in ${result.intervalDays} days</strong>`;
            feedback.style.color = '#10b981';
            feedback.style.fontSize = '1.1rem';

            const existingFeedback = reviewCard.querySelector('.review-info:last-child');
            if (existingFeedback) {
                existingFeedback.after(feedback);
            }

            // Move to next review after a short delay
            setTimeout(() => {
                feedback.remove();
                currentReviewIndex++;
                displayCurrentReview();
                loadStats();
            }, 1000);
        }
    } catch (error) {
        console.error('Error reviewing highlight:', error);
        alert('Failed to save review. Please try again.');
    }
}

// Delete a highlight
async function deleteHighlight(id) {
    if (!confirm('Are you sure you want to delete this highlight?')) {
        return;
    }

    try {
        const response = await fetch(`/api/highlights/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadLibrary();
            loadStats();
        } else {
            alert('Failed to delete highlight');
        }
    } catch (error) {
        console.error('Error deleting highlight:', error);
        alert('Network error: ' + error.message);
    }
}

// Utility functions
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = type;
    element.style.display = 'block';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Tomorrow';
    } else if (diffDays === -1) {
        return 'Yesterday';
    } else if (diffDays > 1 && diffDays < 7) {
        return `In ${diffDays} days`;
    } else if (diffDays < 0 && diffDays > -7) {
        return `${Math.abs(diffDays)} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}
