import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // 1. While checking auth, render nothing to prevent dashboard flash on logout
  if (loading) {
    return null;
  }

  // 2. If not logged in at all, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in, but role is not allowed, go to dashboard (or 403 page)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorized! Render the page.
  return <Outlet />;
}
