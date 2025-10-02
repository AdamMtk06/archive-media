import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MediaPage from './pages/MediaPage';
import UploadPage from './pages/UploadPage';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // إذا كان لا يزال يتم التحقق من المصادقة، عرض مؤشر تحميل
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>جاري التحقق من المصادقة...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout for authenticated pages
const AuthLayout = ({ children }) => (
  <div className="app-layout">
    <Header />
    <div className="app-body">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <HomePage />
                </AuthLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <ProfilePage />
                </AuthLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/media" 
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <MediaPage />
                </AuthLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <UploadPage />
                </AuthLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;