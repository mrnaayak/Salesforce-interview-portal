#  Salesforce Interview Q&A Portal

A web-based portal for managing and learning Salesforce interview questions and answers with role-based access (Admin and User modes).

##  Project Overview

This application provides:
- **Admin Dashboard**: Full CRUD functionality to manage interview questions and answers
- **User Mode**: Read-only access to view and practice interview questions
- **Secure Login**: Authentication system for admin access
- **Responsive Design**: Works on desktop and mobile devices

##  Project Structure

```
AI Website/
├── pages/              # HTML pages (to be organized)
├── scripts/            # JavaScript files (to be organized)
├── styles/             # CSS stylesheets (to be organized)
├── index.html          # Main landing page
├── admin.html          # Admin dashboard
├── admin-login.html    # Admin login page
├── user.html           # User learning mode
├── script.js           # Main script
├── admin-script.js     # Admin functionality
├── admin-login-script.js  # Admin authentication
├── user-script.js      # User mode script
├── styles.css          # Main stylesheet
└── README.md           # This file
```

##  Getting Started

1. Open `index.html` in a web browser
2. Choose your role:
   - Click **Admin Dashboard** to access admin panel (requires login)
   - Click **User Learning** to access learning mode (no login required)

##  Admin Features

- Create new interview questions
- Update existing questions and answers
- Delete questions
- View all questions in dashboard
- Secure logout functionality

##  User Features

- View all interview questions
- Read-only access to questions and answers
- Practice interview preparation
- Navigate back to home portal

##  Authentication

Admin features are protected by a login system. Users need to authenticate before accessing admin functionality.

##  Notes

- The project is ready to be organized into the `/pages`, `/scripts`, and `/styles` folders
- All file references need to be updated when files are moved to their respective folders
- The application uses browser localStorage for data persistence

##  Technologies Used

- HTML5
- JavaScript (Vanilla)
- CSS3
- Browser LocalStorage API

---

**Last Updated**: February 2026
