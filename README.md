# Quiz App (Assignment 4)

A full-stack quiz application built with Express/MongoDB backend and React + Redux frontend.

---

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Default Accounts](#default-accounts)
- [Features](#features)
- [Manual Testing Guide](#manual-testing-guide)
- [Technical Notes](#technical-notes)

---

## 🔧 Prerequisites

- **Node.js** 18 or higher
- **MongoDB** running locally at `mongodb://127.0.0.1:27017/quizapp`

---

## 🚀 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `be/` directory with the following variables:
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/quizapp
JWT_SECRET=supersecret
```

4. (Optional) Seed the database with sample data:
```bash
npm run seed
```
This will create default admin/user accounts, a sample quiz, questions, and an article.

5. Start the development server:
```bash
npm run dev
```
Backend will be available at `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd fe
```

2. Install dependencies:
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```
Frontend will be available at `http://localhost:3001`

> **Note:** The frontend expects the backend to be running at `http://localhost:4000`. If you need to change this, update `fe/src/utils/api.js`.

---

## 👤 Default Accounts

After running the seed script, you can log in with these accounts:

| Username | Password   | Role  |
|----------|------------|-------|
| admin    | admin123   | Admin |
| john     | john123    | User  |

---

## ✨ Features

### Authentication
- User registration and login with JWT authentication
- Role-based access control (User vs Admin)
- Protected routes and route guards

### User Features
- Browse available quizzes
- Take quizzes with multiple-choice questions
- View quiz scores immediately after submission
- Restart quizzes
- Browse and read articles

### Admin Features
- Complete dashboard for management
- **Quiz Management:** Create, update, and delete quizzes
- **Question Management:** Add and delete questions for quizzes
- **Article Management:** Create and delete articles
- Real-time CRUD operations

### UI/UX
- Responsive design with Bootstrap 5
- Clean and intuitive interface
- Toast notifications for user feedback

---

## 🧪 Manual Testing Guide

### Authentication Tests
- ✅ Register a new user account
- ✅ Login with user credentials
- ✅ Login with admin credentials
- ✅ Logout functionality
- ✅ Protected route redirects (unauthorized access)
- ✅ Invalid login credentials error handling

### User Flow Tests
- ✅ Fetch and display all available quizzes
- ✅ Start a quiz
- ✅ Select answers for questions
- ✅ Submit quiz and view score
- ✅ Restart quiz functionality
- ✅ View articles list and details

### Admin Flow Tests
- ✅ Create a new quiz
- ✅ Update existing quiz details
- ✅ Delete a quiz (should cascade delete associated questions)
- ✅ Add questions to a quiz
- ✅ Delete questions from a quiz
- ✅ Create new articles
- ✅ Delete articles

### API Error Handling
- ✅ Invalid login credentials
- ✅ Missing or invalid JWT token
- ✅ Unauthorized access attempts
- ✅ Cascading deletes (deleting quiz removes associated questions)

---

## 📝 Technical Notes

- **Data Validation:** Backend uses `express-validator` for request validation
- **Authentication:** JWT tokens stored in `localStorage`
- **API Requests:** Axios interceptor automatically injects Authorization header
- **State Management:** Redux Toolkit for frontend state management
- **Database:** MongoDB with Mongoose ODM
- **Styling:** Bootstrap 5 for responsive UI components

---

## 📂 Project Structure

```
ASM4/
├── be/                  # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── middleware/  # Auth & error handling
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utilities (seed script)
│   │   └── server.js    # Entry point
│   └── package.json
│
└── fe/                  # Frontend (React + Redux)
    ├── src/
    │   ├── pages/       # Page components
    │   ├── store/       # Redux store & slices
    │   ├── utils/       # API configuration
    │   └── main.jsx     # Entry point
    └── package.json
```

---

## 📄 License

This project is for educational purposes (SDN302 Assignment 4).
