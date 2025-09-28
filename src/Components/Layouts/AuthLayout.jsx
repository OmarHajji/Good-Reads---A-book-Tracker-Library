import React from "react";
import { Outlet } from "react-router";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";
import { useContext } from "react";
import { Navigate } from "react-router";
function AuthLayout() {
  const { isAuth } = useContext(AuthGoogleContext);
  return !isAuth ? (
    <div className="auth-layout md:flex md:items-center md:justify-between ">
      <div className="w-full h-screen flex justify-center items-center   md:w-2/3">
        <div className="flex justify-center items-center">
          <Outlet />
        </div>
      </div>
      <div className="hidden md:block w-1/3 h-screen">
        <img className="w-full h-full" src="auth-img.png" alt="Auth" />
      </div>
    </div>
  ) : (
    <Navigate to="/home" />
  );
}

export default AuthLayout;
