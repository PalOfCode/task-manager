# 📝 Task Manager

A full-stack Task Manager web application built with HTML, CSS, JavaScript, Node.js, Express.js, and SQLite.

The application allows users to securely register, log in, manage their tasks, update their profile, customize settings, and track task progress.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected API Routes
- Secure Logout
- Forgot Password
- Change Password

### 📋 Task Management
- Create new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Task status management
- Task priority management
- Due date support
- Search tasks
- Filter tasks by status
- Filter tasks by priority
- Filter tasks by due date
- Clear all tasks

### 📊 Dashboard
- Total task count
- Pending tasks
- In-progress tasks
- Completed tasks
- Task analytics
- Task progress tracking

### 👤 Profile
- View profile
- Update name
- View registered email
- Change password
- Logout

### ⚙️ Settings
- Dark mode
- Notification settings
- Default task priority
- Clear all tasks
- Account management

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- LocalStorage

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- CORS
- dotenv

### Database
- SQLite

### Development Tools
- Visual Studio Code
- Git
- GitHub
- VS Code Live Preview

---

## 📁 Project Structure

```text
TASK MANAGER/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── settings.js
│   │   └── tasks.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── server.js
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── profile.html
├── settings.html
├── forgot-password.html
│
├── auth.js
├── script.js
├── theme.js
├── settings.js
├── style.css
│
├── .gitignore
└── README.md