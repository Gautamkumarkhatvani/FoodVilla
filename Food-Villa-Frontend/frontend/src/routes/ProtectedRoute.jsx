import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  /* LOADING STATE */
  if (loading) {
    return null; 
  }

  /* NOT LOGGED IN */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ROLE GUARD */
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
