import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthGoogleContext } from "../Contexts/AuthGoogleContext";

function ProtectedRoutes() {
  const { isAuth, isLoading } = useContext(AuthGoogleContext);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brown mx-auto"></div>
        <p className="text-zinc-700 dark:text-zinc-400 mt-3 text-center">
          Loading...
        </p>
      </div>
    );
  }

  // If authenticated, show the protected content
  if (isAuth) {
    return <Outlet />;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
}

export default ProtectedRoutes;
