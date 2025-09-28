import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthGoogleProvider } from "./Contexts/AuthGoogleContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={
        "302800819107-i4d7abkbqmnlu9q73vo1hrg6qd9pbags.apps.googleusercontent.com"
      }
    >
      <AuthGoogleProvider>
        <App />
      </AuthGoogleProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
