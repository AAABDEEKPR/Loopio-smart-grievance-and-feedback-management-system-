import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import DeveloperDashboard from './components/DeveloperDashboard';
import { useAuth } from './components/AuthProvider';

import AdminLayout from './components/AdminLayout';
import UsersPage from './components/UsersPage';
import AssignDeveloperPage from './components/AssignDeveloperPage';
import AdminDashboard from './components/AdminDashboard';
import AllFeedbacksPage from './components/AllFeedbacksPage';
import UserProfile from './components/UserProfile';

import HomePage from './components/HomePage';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return (
    <>
      {React.cloneElement(children, { onProfileClick: () => setShowProfile(true) })}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="assign" element={<AssignDeveloperPage />} />
        <Route path="feedbacks" element={<AllFeedbacksPage />} />
      </Route>
      <Route
        path="/developer"
        element={
          <ProtectedRoute role="developer">
            <DeveloperDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
