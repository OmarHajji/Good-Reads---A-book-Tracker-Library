import { createContext, useEffect, useRef, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthAPI } from "../Utils/authApi";

const AuthGoogleContext = createContext();

function AuthGoogleProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  // Common handler after receiving a token
  const onToken = async (tokenResponse) => {
    const accessToken = tokenResponse?.access_token;
    const expiresIn = tokenResponse?.expires_in ?? 3600; // seconds
    if (!accessToken) return;

    localStorage.setItem("token", accessToken);
    const expiresAt = Date.now() + (expiresIn - 60) * 1000; // refresh 60s early
    localStorage.setItem("token_expires_at", String(expiresAt));

    // Schedule silent refresh
    scheduleSilentRefresh(expiresAt);

    // Ensure user profile is present
    try {
      const { data } = await AuthAPI.profile();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setIsAuth(true);
    } catch {
      // Profile failed; try one more silent refresh then retry profile
      const ok = await silentRefresh();
      if (ok) {
        const { data } = await AuthAPI.profile();
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setIsAuth(true);
      } else {
        logout();
      }
    }
  };

  // Interactive login (shows consent when needed)
  const googleLogin = useGoogleLogin({
    scope: "openid email profile https://www.googleapis.com/auth/books",
    prompt: "consent",
    include_granted_scopes: true,
    onSuccess: onToken,
    onError: (err) => console.error("Google login error:", err),
  });

  // Silent login (no UI; reuses prior grant)
  const googleLoginSilent = useGoogleLogin({
    scope: "openid email profile https://www.googleapis.com/auth/books",
    prompt: "", // silent if possible
    include_granted_scopes: true,
    onSuccess: onToken,
    onError: (err) => console.warn("Silent refresh failed:", err),
  });

  const scheduleSilentRefresh = (expiresAtMs) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const delay = Math.max(5000, expiresAtMs - Date.now()); // at least 5s
    refreshTimerRef.current = setTimeout(() => {
      silentRefresh();
    }, delay);
  };

  const silentRefresh = async () => {
    try {
      // Try silent token acquisition (no popup if the grant exists)
      await googleLoginSilent();
      return true;
    } catch {
      return false;
    }
  };

  function logout() {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expires_at");
    setUser(null);
    setIsAuth(false);
  }

  // Handle global 401 events from API layer (try refresh instead of logging out)
  useEffect(() => {
    const onAuth401 = async () => {
      const ok = await silentRefresh();
      if (!ok) logout();
    };
    window.addEventListener("auth:401", onAuth401);
    return () => window.removeEventListener("auth:401", onAuth401);
  }, []);

  // Restore session on load
  useEffect(() => {
    const restore = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Schedule refresh based on stored expiry; if missing, query token info
      const storedExp = Number(localStorage.getItem("token_expires_at") || 0);
      if (storedExp > Date.now()) {
        scheduleSilentRefresh(storedExp);
      } else {
        // Try to infer remaining time; fallback to a quick silent refresh
        try {
          const info = await AuthAPI.tokenInfo(token);
          const newExpiresAt =
            Date.now() + (Number(info.data.expires_in ?? 3600) - 60) * 1000;
          localStorage.setItem("token_expires_at", String(newExpiresAt));
          scheduleSilentRefresh(newExpiresAt);
        } catch {
          const ok = await silentRefresh();
          if (!ok) return logout();
        }
      }

      // Load or refresh profile
      try {
        const cached = localStorage.getItem("user");
        if (cached) setUser(JSON.parse(cached));
        else {
          const { data } = await AuthAPI.profile();
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
        setIsAuth(true);
      } catch {
        // If profile fails, try a refresh once
        const ok = await silentRefresh();
        if (ok) {
          const { data } = await AuthAPI.profile();
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          setIsAuth(true);
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    restore();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  return (
    <AuthGoogleContext.Provider
      value={{ user, isAuth, loading, googleLogin, logout }}
    >
      {children}
    </AuthGoogleContext.Provider>
  );
}

export { AuthGoogleContext, AuthGoogleProvider };
