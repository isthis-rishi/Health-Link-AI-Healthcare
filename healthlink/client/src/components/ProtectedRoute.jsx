import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const RoleRoute = ({ role, children }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile.role !== role) {
    const dashboardMap = {
      patient: "/patient/dashboard",
      clinic: "/clinic/dashboard",
      pharmacy: "/pharmacy/dashboard"
    };
    return <Navigate to={dashboardMap[userProfile.role] || "/login"} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (userProfile) {
    const dashboardMap = {
      patient: "/patient/dashboard",
      clinic: "/clinic/dashboard",
      pharmacy: "/pharmacy/dashboard"
    };
    return <Navigate to={dashboardMap[userProfile.role] || "/"} replace />;
  }

  return children;
};
