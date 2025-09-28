import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Container from "../UI/Container";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);

  const { googleLogin, signup, loading, isAuth } =
    useContext(AuthGoogleContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuth) {
      navigate("/home");
    }
  }, [isAuth, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      if (
        emailError &&
        value.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        setEmailError("");
      }
    } else if (name === "password") {
      setPassword(value);
      if (
        passwordError &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/.test(value)
      ) {
        setPasswordError("");
      }
    } else if (name === "username") {
      setUsername(value);
      if (usernameError && value.trim()) {
        setUsernameError("");
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    setUsernameError("");

    let hasErrors = false;

    // Validation
    if (!username.trim()) {
      setUsernameError("Username is required!");
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required!");
      hasErrors = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address!");
        hasErrors = true;
      }
    }

    if (!password) {
      setPasswordError("Password is required!");
      hasErrors = true;
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setPasswordError(
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character!"
        );
        hasErrors = true;
      }
    }

    // If no errors, proceed with signup
    if (!hasErrors) {
      const result = await signup(username, email, password);

      if (result.success) {
        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        // Navigate to home page
        navigate("/home");
      } else {
        setEmailError(result.error || "Signup failed. Please try again.");
      }
    }
  }

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <Container className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900">Get Started Now</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brown focus:border-brown"
                placeholder="Enter your username"
              />
              {usernameError && (
                <p className="mt-1 text-sm text-red-600">{usernameError}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brown focus:border-brown"
                placeholder="Enter your email"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPasswordText ? "text" : "password"}
                value={password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brown focus:border-brown"
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute top-10 right-0 pr-3 flex items-center"
                onMouseDown={() => setShowPasswordText(true)}
                onMouseUp={() => setShowPasswordText(false)}
                onMouseLeave={() => setShowPasswordText(false)}
              >
                {showPasswordText ? <FaEye /> : <FaEyeSlash />}
              </button>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-brown hover:text-dark-brown underline"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-brown hover:text-dark-brown underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-brown hover:bg-dark-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown transition-colors disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="ml-2">{loading ? "Loading..." : "Google"}</span>
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brown hover:text-dark-brown transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}

export default SignUp;
