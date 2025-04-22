import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Pattern3 from "../assets/images/pattern_3.png";

// Configure Axios
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing authentication on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/`, { withCredentials: true })
      .then((response) => {
        console.log("Auto-login success:", response.data);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Auto-login failed:", err);
        console.log("Auto-login error response:", err.response?.data);
      });
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/token/`,
        { username, password },
        { withCredentials: true }
      );
      console.log("Login response:", response);
      console.log("Response headers:", response.headers);
      console.log("Cookies after login:", document.cookie); // Note: HttpOnly cookies won't appear

      const protectedResponse = await axios.get(`${API_URL}/api/user/`, {
        withCredentials: true,
      });
      console.log("Protected data:", protectedResponse.data);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      console.log("Error response:", err.response?.data);
      console.log("Error headers:", err.response?.headers);
      setError(err.response?.data?.detail || "Invalid credentials");
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
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900"
              >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-opacity-60 hover:text-indigo-500"
                >
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

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              } focus:outline-none`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don’t have an account?
              <Link
                to="/sign-up"
                className="ml-1 font-semibold text-[#5A8CFF] hover:text-indigo-500"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}