/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Pattern3 from "../assets/images/pattern_3.png";

// Configure Axios
axios.defaults.withCredentials = true;

// Utility to get cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [protectedData, setProtectedData] = useState(null);
  const navigate = useNavigate();

  // Check for existing cookie on mount
  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      // If cookie exists, try to fetch protected data and redirect
      axios
        .get("/api/user/", { withCredentials: true })
        .then((response) => {
          setProtectedData(response.data);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Auto-login failed:", err);
        });
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Login request
      const { data } = await axios.post(
        "/api/token/",
        { username, password, remember_me: rememberMe },
        { withCredentials: true }
      );
      console.log("Login successful:", data);

      if (!rememberMe) {
        // If "Remember Me" is unchecked, store token in memory
        localStorage.setItem("access_token", data.access); // Temporary storage (or use state/context)
      }

      // Step 2: Fetch protected data
      const config = rememberMe
        ? { withCredentials: true } // Use cookies
        : { headers: { Authorization: `Bearer ${data.access}` } }; // Use token directly

      const protectedResponse = await axios.get("/api/user/", config);
      setProtectedData(protectedResponse.data);
      console.log("Protected data:", protectedResponse.data);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.detail || "Invalid credentials");
      } else if (err.request) {
        setError("No response from server. Check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${Pattern3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#4880FF",
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-5">
            Login to Account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                autoComplete="username"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#F1F4F9] px-3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <a href="#" className="text-sm text-opacity-60 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#F1F4F9] px-3"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="remember-me" className="ml-3 text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
              } focus:outline-none`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don’t have an account?
              <Link to="/sign-up" className="ml-1 font-semibold text-[#5A8CFF] hover:text-indigo-500">
                Create Account
              </Link>
            </p>
          </form>

          {protectedData && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="text-sm font-bold">Protected Data:</h3>
              <pre className="text-xs">{JSON.stringify(protectedData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}