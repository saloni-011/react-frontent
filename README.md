# TaskFlow — Modern Responsive React Frontend (WA-3)

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6-ca4245.svg?logo=react-router)](https://reactrouter.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, responsive React single-page application built for **Valentius Kryptix Intern Hub (Task WA-3)**. It consumes the live REST API built in **WA-2**, featuring client-side form validation, robust error and loading states, authentication context, and multi-route navigation.

---

## 🎯 Project Overview & WA-3 Requirements Matrix

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **At least 3 distinct routes/pages** | 6 distinct routes: Task List (`/tasks`), Task Detail (`/tasks/:id`), Create Task (`/tasks/new`), Edit Task (`/tasks/:id/edit`), Auth (`/login`, `/register`), and 404 (`*`). | ✅ Complete |
| **Fetches real data from API** | Consumes live REST API endpoints (`/api/tasks`, `/api/auth`) via centralized `api.js` client — no mock arrays. | ✅ Complete |
| **Visible Loading & Error states** | Animated spinners (`LoadingSpinner`), status badges, alert banners (`ErrorMessage`) with retry triggers, and an offline backend detector. | ✅ Complete |
| **Client-side Form Validation** | Validation on Task Title (min 2, max 200 chars), Description, Status enum, plus email regex & password length on auth forms. | ✅ Complete |
| **Proper State Management** | React `useState`, `useEffect`, `useCallback`, and custom `AuthContext` for global session management without unnecessary dependencies. | ✅ Complete |
| **Responsive Layout** | Desktop multi-column layout, mobile hamburger navigation drawer, and flexible grid cards. | ✅ Complete |

---

## 🏗️ Architecture & Project Structure

```
react-frontent/
├── index.html                 # HTML template with Plus Jakarta Sans & JetBrains Mono
├── package.json               # Dependencies and scripts (React 18, React Router 6, Lucide)
├── vite.config.js             # Vite configuration with React plugin
├── .env                       # Local environment variables
├── .env.example               # Template environment configuration
├── dist/                      # Production build assets
└── src/
    ├── main.jsx               # Application entry point with BrowserRouter
    ├── App.jsx                # Route registry & application layout shell
    ├── index.css              # Modern CSS design system & responsive styling
    ├── context/
    │   └── AuthContext.jsx    # Authentication & backend connectivity state provider
    ├── services/
    │   └── api.js             # Fetch wrapper with JWT headers, error normalization & timeouts
    ├── components/
    │   ├── Navbar.jsx         # Header with desktop/mobile navigation & API status pill
    │   ├── Footer.jsx         # App footer with metadata
    │   ├── ProtectedRoute.jsx # Route guard redirecting unauthenticated users to /login
    │   ├── StatusBadge.jsx    # Color-coded badge for PENDING, IN_PROGRESS, COMPLETED
    │   ├── LoadingSpinner.jsx # Animated spinner with configurable text & sizes
    │   ├── ErrorMessage.jsx   # Error alert card with retry button & backend instructions
    │   ├── ConfirmModal.jsx   # Accessible confirmation modal for task deletions
    │   └── ServerStatusBanner.jsx # Real-time alert when backend server is offline
    └── pages/
        ├── TaskListPage.jsx   # Dashboard with stats, search, status filter & task cards
        ├── TaskDetailPage.jsx # Comprehensive task view with timestamps & quick actions
        ├── TaskFormPage.jsx   # Dual-purpose Create & Edit task form with instant validation
        ├── LoginPage.jsx      # Login page with demo credentials helper
        ├── RegisterPage.jsx   # Account creation with input validation & auto-login
        └── NotFoundPage.jsx   # 404 page for unmatched routes
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v24+ recommended)
- **WA-2 REST API Backend**: The backend built in WA-2 (located in `../rest-api-task` or running on port `5000`).

---

### 2. Start the Backend Server (WA-2)
In a separate terminal window, start your backend server:

```bash
cd ../rest-api-task
npm start
# Expected output: Server is running and listening on http://localhost:5000
```

> **Note:** The backend provides authentication endpoints (`/api/auth/register`, `/api/auth/login`) and task management endpoints (`/api/tasks`).

---

### 3. Configure & Run the Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd react-frontent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   The app connects to `http://localhost:5000/api` by default. To customize this, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Contents of `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   Open your browser at **`http://localhost:3000`** (or the URL shown in your terminal).

---

## 🧪 Testing the Requirements

### A. Testing Form Validation
1. Click **"New Task"** in the navigation bar.
2. Submit the form with an empty title — observe the inline validation error: *"Title is required and cannot be empty."*
3. Type a single character — observe: *"Title must be at least 2 characters."*
4. Type over 200 characters — observe the character counter turn red and block submission.
5. Provide a valid title, description, and status, then click **"Create Task"** — the task will save to the SQLite/Prisma backend and redirect to the detail view.

### B. Testing Graceful Offline Error States (Requirement #5)
1. Stop the backend server in terminal (e.g., press `Ctrl + C` in the backend window).
2. Refresh the frontend in your browser.
3. Observe:
   - The top banner displays: **"Backend Offline: Cannot reach the REST API at http://localhost:5000"**.
   - The navigation pill switches from **"API Online"** to **"API Offline"**.
   - The task list gracefully displays a descriptive error message with a **"Try Again"** button instead of breaking or showing a blank screen.
4. Restart the backend server (`npm start`) and click **"Try Again"** or **"Check Connection"** — the application recovers seamlessly.

### C. Testing Production Build
Verify the production bundle compiles cleanly:
```bash
npm run build
```
Preview the built production bundle:
```bash
npm run preview
```

---

## 🌐 API Endpoints Used

| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and obtain JWT token |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user |
| `GET` | `/api/tasks` | List all tasks (supports `?status=` and `?search=`) |
| `GET` | `/api/tasks/:id` | Retrieve single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## 📤 Submission Steps to GitHub

To submit your task URL on the Intern Hub:

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: complete WA-3 React frontend with REST API integration"
   ```

2. Push to your GitHub account:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/react-frontend.git
   git push -u origin main
   ```

3. Paste your public GitHub repository URL into the Intern Hub task submission input.

---

### Author
Developed by **Saloni** for the **Valentius Kryptix Internship** (Task WA-3).

