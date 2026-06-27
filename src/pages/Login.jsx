import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Forgot from "./ForgotPassword";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        userName: username,
        password: password,
      });

      if (res.respCode === 0) {

        const { username: userName, role_function } = res.respData;
        localStorage.setItem("isLogin", true)
        localStorage.setItem(
          "user",
          JSON.stringify({ userName, role_function }),
        );
        setTimeout(() => {
          toast.success(res.respMsg);
          navigate("/app/dashboard");
        }, 200);

      } else if (res.respCode === 3) {
        toast.error(res.respMsg);
        navigate("/forgot");
      }
      else {
        toast.error(res.respMsg);
        if (res.respData && typeof res.respData === "object") {
          Object.values(res.respData).forEach((msg) => {
            toast.error(msg);
          });
        }
      }
    } catch (error) {
      toast.error(error)
    }
    finally {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL */}
        <div className="lg:w-1/2 bg-orange-500 text-white flex flex-col justify-center px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome To HelloPe !
          </h1>
          <p className="mb-8 text-sm opacity-90">
            Fast, Secure & Reliable Payment Gateway
          </p>
          <ul className="space-y-4 text-sm">
            <li>⚡ Instant UPI Payments</li>
            <li>🔒 HMAC-SHA256 Security</li>
            <li>📊 Real-time Dashboard</li>
            <li>💳 Multi Payment Support</li>
            <li>🚀 High Success Rate</li>
          </ul>
          <div className="mt-10 text-xs opacity-80">
            Trusted by Merchants across India 🇮🇳
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-10">
          <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-center mb-4">
              <img
                src="/logo1.avif"
                alt="HelloPe Logo"
                className="h-12 object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-center mb-1 uppercase">
              Welcome back
            </h2>
            <p className="text-center text-[#0A66C2] mb-6 text-sm">
              Login to access the Pay-In Admin Dashboard
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <div className="relative mt-1">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                  <input
                    type="text"
                    value={username}
                    autoComplete="off"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@hellope.com"
                    className="w-full pl-10 pr-3 py-2 border-b border-gray-300 focus:outline-none focus:border-orange-500"
                    style={{ backgroundColor: "transparent" }}
                  />

                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <div className="relative mt-1">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border-b border-gray-300 focus:outline-none focus:border-orange-500 bg-transparent"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg transition"
                >
                  {loading ? "Signing in..." : "Access Dashboard →"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="text-orange-500 cursor-pointer hover:underline"
                >
                  Forgot your password?
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
