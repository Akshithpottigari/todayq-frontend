import React from "react";
import { useStore } from "@/hooks/useStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuth = () => {
  const { authData, setAuthData } = useStore();
  const location = useLocation();
  return authData ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};
