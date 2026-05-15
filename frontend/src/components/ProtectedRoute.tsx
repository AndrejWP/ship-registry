import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!storage.getToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

