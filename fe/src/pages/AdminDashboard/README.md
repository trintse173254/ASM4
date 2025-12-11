# Admin Dashboard Components

This folder contains the modular components for the Admin Dashboard.

## Structure

```
AdminDashboard/
├── index.js              # Exports all components
├── Sidebar.jsx           # Left sidebar navigation
├── Home.jsx              # Dashboard overview/stats
├── ManageQuizzes.jsx     # Quiz CRUD operations
├── ManageQuestions.jsx   # Question CRUD operations
└── ManageArticles.jsx    # Article CRUD operations
```

## Components

### Sidebar
- Modern dark sidebar with icons
- User profile display
- Navigation menu
- Logout button

### Home
- Dashboard statistics
- Quick overview of quizzes, questions, and articles
- Quick start guide

### ManageQuizzes
- Create new quizzes
- Edit existing quizzes
- Delete quizzes
- Navigate to questions management

### ManageQuestions
- Select quiz from dropdown
- Add questions with multiple choice options
- Edit questions
- Delete questions
- Shows correct answer with badge

### ManageArticles
- Create articles
- Edit articles
- Delete articles
- Preview article content

## Usage

The main `AdminDashboard.jsx` component orchestrates these sub-components and handles routing between them.

