import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While the session cookie is being validated, don't redirect yet
  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
