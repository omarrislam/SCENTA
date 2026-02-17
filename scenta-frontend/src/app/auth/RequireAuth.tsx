import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const location = useLocation();
  const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);
  const token = localStorage.getItem("scenta-token");

  if (!user || (hasApi && !token)) {
    return <Navigate to="/auth/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
