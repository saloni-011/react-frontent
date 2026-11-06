import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServerStatusBanner from './components/ServerStatusBanner';
import ProtectedRoute from './components/ProtectedRoute';

import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TaskFormPage from './pages/TaskFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar />
        <ServerStatusBanner />

        <main className="app-main">
          <Routes>
            {/* Default redirect to tasks */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Task Routes (Requirement: at least 3 distinct routes) */}
            {/* 1. List View */}
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskListPage />
                </ProtectedRoute>
              }
            />

            {/* 2. Create Form View */}
            <Route
              path="/tasks/new"
              element={
                <ProtectedRoute>
                  <TaskFormPage />
                </ProtectedRoute>
              }
            />

            {/* 3. Detail View */}
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetailPage />
                </ProtectedRoute>
              }
            />

            {/* 4. Edit Form View */}
            <Route
              path="/tasks/:id/edit"
              element={
                <ProtectedRoute>
                  <TaskFormPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

