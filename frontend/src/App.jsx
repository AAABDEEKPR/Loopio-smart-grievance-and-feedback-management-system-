import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import DeveloperDashboard from './components/DeveloperDashboard';
import Navbar from './components/Navbar';
import { useAuth } from './components/AuthProvider';

import UserProfile from './components/UserProfile';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return (
    <>
      <Navbar onProfileClick={() => setShowProfile(true)} />
      {children}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
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
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
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
