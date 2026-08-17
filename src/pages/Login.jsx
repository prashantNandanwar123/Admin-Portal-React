import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Forgot from "./ForgotPassword";
import { toast } from "react-toastify";
import logo1 from "../assets/img-1.jpeg";
import bgImage from "../assets/leftimg.png";
import {
  FaBolt,
  FaShieldAlt,
  FaChartLine,
  FaCreditCard,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaFlag,
} from "react-icons/fa";

import { HiChartBar } from "react-icons/hi";


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

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
    <div className="bg-[#f4f4f4] p-4 md:p-6 lg:p-8 xl:p-3 min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-7xl xl:max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-2">
          {/* Left Section */}
          <div className="bg-[#05070B] text-white relative overflow-hidden cursor-default">
            <div className="px-10 py-6 xl:px-6 xl:py-4 h-full flex flex-col relative">
              {/* Logo */}
              <img
                src={logo1}
                alt="HelloPe"
                className="h-32 xl:h-20 object-contain
            ml-[-80px]
            sm:ml-[-120px]
            md:ml-[-150px]
            lg:ml-[-180px]
            xl:ml-[-120px]
          "
              />
              {/* Heading */}
              <div>
                <h1 className="lg:text-4xl xl:text-2xl text-2xl font-bold">
                  Welcome to{" "}
                  <span className="text-[#FFC400]">HelloPe!</span>{" "}
                  👋
                </h1>
                <p className="mt-2 xl:mt-1 text-lg xl:text-sm text-gray-300">
                  Fast,
                  <span className="text-[#FFC400] font-medium"> Secure & Reliable </span>
                  Payment Gateway
                </p>
              </div>

              {/* Features */}
              <div className="mt-7 xl:mt-3 space-y-5 xl:space-y-2.5 relative z-10">
                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 xl:w-9 xl:h-9 rounded-xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl xl:text-lg shadow">
                    ⚡
                  </div>
                  <div className="ml-5 xl:ml-3">
                    <h3 className="text-lg xl:text-sm font-semibold">Instant UPI Payments</h3>
                    <p className="text-gray-400 text-sm xl:text-xs mt-1 xl:mt-0">Lightning fast transactions, 24/7</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 xl:w-9 xl:h-9 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl xl:text-lg">
                    🛡️
                  </div>
                  <div className="ml-5 xl:ml-3">
                    <h3 className="text-lg xl:text-sm font-semibold">HMAC-SHA256 Security</h3>
                    <p className="text-gray-400 text-sm xl:text-xs mt-1 xl:mt-0">Enterprise grade security for your data</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 xl:w-9 xl:h-9 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl xl:text-lg">
                    📊
                  </div>
                  <div className="ml-5 xl:ml-3">
                    <h3 className="text-lg xl:text-sm font-semibold">Real-time Dashboard</h3>
                    <p className="text-gray-400 text-sm xl:text-xs mt-1 xl:mt-0">Track and monitor in real-time</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 xl:w-9 xl:h-9 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl xl:text-lg">
                    💳
                  </div>
                  <div className="ml-5 xl:ml-3">
                    <h3 className="text-lg xl:text-sm font-semibold">Multi Payment Support</h3>
                    <p className="text-gray-400 text-sm xl:text-xs mt-1 xl:mt-0">UPI, Cards, Wallets & more</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 xl:w-9 xl:h-9 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl xl:text-lg">
                    📈
                  </div>
                  <div className="ml-5 xl:ml-3">
                    <h3 className="text-lg xl:text-sm font-semibold">High Success Rate</h3>
                    <p className="text-gray-400 text-sm xl:text-xs mt-1 xl:mt-0">Optimized for maximum success</p>
                  </div>
                </div>
              </div>

              {/* Shield Illustration*/}
              <img
                src={bgImage}
                alt="Security"
                className="absolute w-[380px] xl:w-[240px] object-contain pointer-events-none"
                style={{ right: "-22px", bottom: "85px" }}
              />
              {/* Divider line with gap below Features */}
              <div className="border-b border-[#1f1f1f] w-3/4 mt-13 xl:mt-6"></div>
              {/* Bottom */}
              <div className="mt-5 xl:mt-2 pt-2 xl:pt-1 flex items-center text-gray-300 text-xs relative z-10">
                <span className="text-[#FFC400] text-xl xl:text-base mr-3 xl:mr-2">
                  <FaShieldAlt />
                </span>
                Trusted by Merchants across India
                <svg
                  className="ml-2 w-5 h-5 rounded-[2px] overflow-hidden"
                  viewBox="0 0 24 16"
                >
                  <rect width="24" height="5.33" y="0" fill="#FF9933" />
                  <rect width="24" height="5.33" y="5.33" fill="#FFFFFF" />
                  <rect width="24" height="5.33" y="10.66" fill="#138808" />
                  <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.3" />
                  <circle cx="12" cy="8" r="0.3" fill="#000080" />
                </svg>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="bg-[#f8f8f8] flex items-center justify-center p-10 xl:p-5">
            <div className="w-full max-w-[560px] xl:max-w-[400px] bg-white rounded-[30px] xl:rounded-[22px] shadow-xl px-12 py-12 xl:px-7 xl:py-6">
              {/* Logo */}
              <div className="flex justify-center">
                <img
                  src="/logo1.avif"
                  alt="HelloPe"
                  className="h-14 xl:h-9 object-contain"
                />
              </div>
              {/* Heading */}
              <div className="text-center mt-4 xl:mt-2 cursor-default">
                <h2 className="text-[38px] xl:text-2xl font-bold text-[#111]">
                  Welcome Back
                </h2>
                <p className="text-gray-500 mt-1 xl:mt-0.5 text-lg xl:text-sm">
                  Login to access the Pay-In Admin Dashboard
                </p>
              </div>
              {/* Form */}
              <form onSubmit={handleLogin} className="mt-10 xl:mt-5 space-y-6 xl:space-y-3.5">
                {/* Username */}
                <div>
                  <label className="text-[17px] xl:text-sm font-semibold text-[#222]">
                    Username
                  </label>
                  <div className="relative mt-3 xl:mt-1.5">
                    <FaUser className="absolute left-5 xl:left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-lg xl:text-sm" />
                    <input
                      type="text"
                      value={username}
                      autoComplete="off"
                      required
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z]/g, "");
                        setUsername(value);
                      }}
                      placeholder="admin@hellope.com"
                      className="w-full h-16 xl:h-11 rounded-xl border border-gray-300 bg-white pl-14 xl:pl-10 pr-5 xl:pr-4 text-lg xl:text-sm focus:border-[#FFC400] focus:ring-2 focus:ring-[#FFC400]/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[17px] xl:text-sm font-semibold text-[#222]">
                    Password
                  </label>
                  <div className="relative mt-3 xl:mt-1.5">
                    <FaLock className="absolute left-5 xl:left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-lg xl:text-sm" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-16 xl:h-11 rounded-xl border border-gray-300 bg-white pl-14 xl:pl-10 pr-14 xl:pr-10 text-lg xl:text-sm focus:border-[#FFC400] focus:ring-2 focus:ring-[#FFC400]/20 outline-none transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 xl:right-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash size={20} className="xl:!w-4 xl:!h-4" /> : <FaEye size={20} className="xl:!w-4 xl:!h-4" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 xl:h-11 rounded-xl bg-[#FFC400] hover:bg-[#FEC803] transition font-semibold cursor-pointer text-xl xl:text-base text-black shadow-md"
                >
                  {loading ? "Signing in..." : "Access Dashboard →"}
                </button>
                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="mx-4 xl:mx-2 text-gray-500 xl:text-xs font-medium rounded-full px-3 xl:px-2 border border-gray-300">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Forgot */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot")}
                    className="text-[#FEC803] hover:underline text-lg xl:text-sm font-medium cursor-pointer"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile — UNCHANGED, same as before */}
        {/* Mobile */}
        <div className="lg:hidden">
          {/* Top Black Section */}
          <div className="bg-[#0b0b0b] text-white px-6 pt-8 pb-20 relative overflow-hidden">
            <div className="flex justify-center">
              {/* Logo */}
              <img
                src={logo1}
                alt="HelloPe"
                className="h-32 object-contain"
                style={{ marginLeft: "-151px" }}
              />
            </div>
            <h2 className="text-xl font-bold leading-tight text-center">
              Welcome to{" "}
              <span className="text-[#FFC400]">HelloPe!</span>{" "}
              👋
            </h2>
            <p className="text-gray-300 text-center mt-1 text-sm">
              Fast, Secure & Reliable Payment Gateway
            </p>

            <div className="mt-8 space-y-5 relative z-10">
              {[
                ["⚡", "Instant UPI Payments", "Lightning fast transactions, 24/7"],
                ["🛡️", "HMAC-SHA256 Security", "Enterprise grade security for your data"],
                ["📊", "Real-time Dashboard", "Track and monitor in real-time"],
                ["💳", "Multi Payment Support", "UPI, Cards, Wallets & more"],
                ["📈", "High Success Rate", "Optimized for maximum success"],
              ].map(([icon, title, sub]) => (
                <div key={title} className="flex items-center">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#151515] border border-[#2a2a2a] flex items-center justify-center text-[#FFC400] text-lg">
                    {icon}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shield*/}
            <svg
              viewBox="0 0 200 280"
              className="absolute right-1 top-95 w-32 h-auto pointer-events-none select-none"
            >
              {/* dotted trail from top-right down to the badge */}
              <path
                d="M190 10 C 140 30, 150 90, 110 120"
                fill="none"
                stroke="#FFC400"
                strokeWidth="2"
                strokeDasharray="1 8"
                strokeLinecap="round"
              />
              <circle cx="190" cy="10" r="4" fill="#FFC400" />

              {/* glow platform */}
              <ellipse cx="100" cy="230" rx="70" ry="18" fill="#FFC400" opacity="0.15" />
              <ellipse cx="100" cy="222" rx="55" ry="10" fill="#FFC400" opacity="0.25" />

              {/* card, tucked behind shield */}
              <g transform="translate(105,150) rotate(8)">
                <rect x="0" y="0" width="70" height="45" rx="8" fill="#1c1c1c" stroke="#3a3a3a" />
                <rect x="10" y="12" width="40" height="6" rx="3" fill="#FFC400" opacity="0.8" />
                <rect x="10" y="24" width="24" height="5" rx="2.5" fill="#555" />
              </g>

              {/* shield */}
              <g transform="translate(35,110)">
                <path
                  d="M45 0 L85 15 V55 C85 85 65 100 45 110 C25 100 5 85 5 55 V15 Z"
                  fill="#0f0f0f"
                  stroke="#FFC400"
                  strokeWidth="2"
                />
                {/* lock */}
                <rect x="30" y="50" width="30" height="24" rx="4" fill="#FFC400" />
                <path
                  d="M35 50 V30 a10 10 0 0 1 20 0 V50"
                  fill="none"
                  stroke="#FFC400"
                  strokeWidth="5"
                />
                <circle cx="45" cy="60" r="4" fill="#0f0f0f" />
              </g>
            </svg>
          </div>

          {/* Login Card */}
          <div className="-mt-8 relative z-30 bg-white rounded-t-[38px] px-6 pt-8 pb-8 shadow-xl">
            {/* Yellow Top Line */}
            <div className="w-20 h-1.5 rounded-full bg-[#FFC400] mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-center text-gray-500 mt-2 text-sm">
              Login to access the Pay-In Admin Dashboard
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {/* Username */}
              <div>
                <label className="font-semibold text-sm">Username</label>
                <div className="relative mt-2">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    required
                    autoComplete="off"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@hellope.com"
                    className="w-full h-14 rounded-xl border border-gray-300 pl-12 pr-4 outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="font-semibold text-sm">Password</label>
                <div className="relative mt-2">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 rounded-xl border border-gray-300 pl-12 pr-12 outline-none focus:border-[#FFC400]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#FFC400] font-bold text-base"
              >
                {loading ? "Signing in..." : "Access Dashboard →"}
              </button>

              {/* OR */}
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="mx-3 text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              {/* Forgot */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="text-[#FFC400] font-medium"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-2 flex items-center text-gray-300 text-xs relative z-10">
                <span className="text-[#FFC400] text-xl mr-3">
                  <FaShieldAlt />
                </span>
                Trusted by Merchants across India
                <svg className="ml-2 w-5 h-5 rounded-[2px] overflow-hidden" viewBox="0 0 24 16">
                  <rect width="24" height="5.33" y="0" fill="#FF9933" />
                  <rect width="24" height="5.33" y="5.33" fill="#FFFFFF" />
                  <rect width="24" height="5.33" y="10.66" fill="#138808" />
                  <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.3" />
                  <circle cx="12" cy="8" r="0.3" fill="#000080" />
                </svg>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}












