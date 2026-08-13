import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import BrowseQuizzes from '../pages/student/BrowseQuizzes';
import QuizAttempt from '../pages/student/QuizAttempt';
import ResultReview from '../pages/student/ResultReview';
import Performance from '../pages/student/Performance';
import Leaderboard from '../pages/student/Leaderboard';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import QuizManagement from '../pages/admin/QuizManagement';
import QuestionManagement from '../pages/admin/QuestionManagement';
import UserManagement from '../pages/admin/UserManagement';
import AttemptMonitoring from '../pages/admin/AttemptMonitoring';

export default function AppRoutes() {
  const { user } = useAuth();

  const getDefaultRedirect = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
  };

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />

      {/* Protected Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="quizzes" element={<BrowseQuizzes />} />
        <Route path="quiz/:quizId" element={<QuizAttempt />} />
        <Route path="result/:attemptId" element={<ResultReview />} />
        <Route path="performance" element={<Performance />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="quizzes" element={<QuizManagement />} />
        <Route path="quizzes/:quizId/questions" element={<QuestionManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="attempts" element={<AttemptMonitoring />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
    </Routes>
  );
}
