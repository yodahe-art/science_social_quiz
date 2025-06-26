# QESEM EXAM PREP Website

QESEM EXAM PREP is an interactive educational website designed to help Grade 12 students prepare for their national entrance exams. It provides questions organized by section (Natural Science, Social Science), subject, and unit, complete with multiple-choice options and explanations.

## Features

*   **Section-based Learning**: Choose between Natural Science and Social Science streams.
*   **Subject & Unit Organization**: Navigate through subjects (Physics, Chemistry, History, etc.) and their respective units.
*   **Multiple Choice Questions (MCQs)**: Each unit contains a set of MCQs with 4 options.
*   **Instant Feedback**: After submitting an answer, the correct answer and a detailed explanation are shown.
*   **Sticky Navigation Bar**: Easy navigation with a persistent header.
*   **Back Button**: Navigate to previous levels (Unit → Subject → Section → Home).
*   **Search Functionality**: Filter subjects or units within the current view.
*   **Progress Tracker**: Saves your scores for completed units and displays overall progress (uses `localStorage`).
*   **Light/Dark Mode Toggle**: Switch between light and dark themes for comfortable viewing (preference saved in `localStorage`).
*   **Responsive Design**: Adapts to various screen sizes for use on desktop and mobile devices.
*   **Animated Page Transitions**: Smooth animations when switching between pages.
*   **Timer for Question Sets**: Each unit's question set is timed to simulate exam conditions.
*   **Question Review Mode**: After completing a unit, review your answers, the correct answers, and explanations.
*   **Bookmarking**: Bookmark questions for later review and view them on a dedicated bookmarks page (uses `localStorage`).
*   **Answer Submission Animations**: Visual feedback (shake/pulse) on submitting answers.

## Technologies Used

*   **HTML5**: For semantic structure and content.
*   **CSS3**: For styling, layout (including Flexbox and Grid), responsiveness (media queries), and animations.
*   **Vanilla JavaScript (ES6+)**: For all dynamic behavior, DOM manipulation, interactivity, data management, and `localStorage` usage.

## Project Structure

```
/qesem-exam-prep
│
├── index.html         # Main HTML file for the single-page application
├── style.css          # All CSS styles
├── script.js          # All JavaScript logic
├── /data
│   └── questions.js   # Contains the exam questions, answers, and explanations
├── /assets
│   └── /images
│       ├── natural_science_icon.png  (Placeholder)
│       └── social_science_icon.png   (Placeholder)
└── README.md          # This file
```

## How to Run

1.  **Clone the repository (or download the files):**
    If this were a Git repository, you would clone it. Since you have the files directly, ensure they are all within a single folder named `qesem-exam-prep` (or any name, but keep the internal structure).

2.  **Open `index.html` in your web browser:**
    *   Navigate to the directory where you saved the files.
    *   Double-click the `index.html` file.
    *   Alternatively, right-click `index.html` and choose "Open with" your preferred web browser (e.g., Chrome, Firefox, Edge, Safari).

    The website should now be running locally in your browser. No special server setup is required as it's built purely with client-side technologies (HTML, CSS, JavaScript).

## Development Notes

*   **Question Data**: All questions are stored in `data/questions.js`. To add more questions, subjects, or units, edit this file following the existing structure.
*   **Styling**: All styles are in `style.css`. Theme variables for light/dark mode are defined at the top of this file.
*   **Logic**: All application logic is in `script.js`.

## Future Enhancements (Potential)

*   More sophisticated global search (e.g., search questions directly by keyword).
*   User accounts and server-side progress saving (would require backend).
*   More diverse question types.
*   Admin panel for managing questions.
*   Actual sound effects for answer submissions.
*   More detailed analytics on the progress page.
```
