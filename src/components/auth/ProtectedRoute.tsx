
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType: 'user' | 'vendor' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredType }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    // User not logged in, redirect to appropriate login page
    switch (requiredType) {
      case 'user':
        return <Navigate to="/user/login" replace />;
      case 'vendor':
        return <Navigate to="/vendor/login" replace />;
      case 'admin':
        return <Navigate to="/admin/login" replace />;
      default:
        return <Navigate to="/user/login" replace />;
    }
  }

  // Check if user has the required role
  if (currentUser.role !== requiredType) {
    // User does not have the right role, redirect to appropriate home page
    switch (currentUser.role) {
      case 'user':
        return <Navigate to="/user" replace />;
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
