// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '../state/state';


interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/auth" }) => {
  const { user } = useAuthState();

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  // If the user is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;