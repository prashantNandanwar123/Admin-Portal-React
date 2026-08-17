import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import logo1 from "../assets/img-1.jpeg";
import bgImage from "../assets/leftimg.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  //----- Send Forgot Password APi CAll ----
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!userName) {
      toast.error("Please enter username");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post("/sendForgotPasswordOtp",
        {
          userName,
        }
      );

      if (response?.respCode === 0) {
        console.log(response);
        toast.success(response.respMsg);
        setOtpSent(true);   // OTP field show hoga
      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  //----- Verify Forgot Password APi CAll ----
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/verifyForgotPasswordOtp",
        {
          userName,
          otp,
        }
      );

      if (response?.respCode === 0) {
        toast.success(response.respMsg);
        setOtpVerified(true); // Password fields show honge
      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  //---- Password Validation ----
  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };


  //----- Handle Password-----
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (
      !passwordValidation.length ||
      !passwordValidation.uppercase ||
      !passwordValidation.lowercase ||
      !passwordValidation.number ||
      !passwordValidation.special
    ) {
      toast.error(
        "Password must contain 8+ characters, uppercase, lowercase, number and special character"
      );
      return;
    }
    if (!userName || !password || !confirmPassword) {
      toast("Please fill all fields", {
        icon: "⚠️",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/submitForgotPassword", {
        userName,
        password,
        confPassword: confirmPassword,
      });

      if (response?.respCode === 0) {
        console.log("rest password Message--->>>", response?.respMsg);
        toast.success(response?.respMsg);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(response?.respMsg);
      }

    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const req = <span className="text-red-500">*</span>;

  return (
    <div className="bg-[#f4f4f4] min-h-screen w-full p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Section- Desktop */}
        <div className="hidden lg:grid lg:grid-cols-2 cursor-default">

          {/* Left Section */}
          <div className="bg-[#05070B] text-white relative overflow-hidden">
            <div className="px-10 py-6 h-full flex flex-col relative">
              {/* Logo */}
              <img
                src={logo1}
                alt="HelloPe"
                className="h-32 object-contain"
                style={{ marginLeft: "-210px" }}
              />
              {/* Heading */}
              <div>
                <h1 className="lg:text-4xl text-2xl font-bold">
                  Welcome to{" "}
                  <span className="text-[#FFC400]">HelloPe!</span>{" "}
                  👋
                </h1>
                <p className="mt-2 text-lg text-gray-300">
                  Fast,
                  <span className="text-[#FFC400] font-medium"> Secure & Reliable </span>
                  Payment Gateway
                </p>
              </div>

              {/* Features */}
              <div className="mt-7 space-y-5 relative z-10">
                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 rounded-xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl shadow">
                    ⚡
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-semibold">Instant UPI Payments</h3>
                    <p className="text-gray-400 text-sm mt-1">Lightning fast transactions, 24/7</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl">
                    🛡️
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-semibold">HMAC-SHA256 Security</h3>
                    <p className="text-gray-400 text-sm mt-1">Enterprise grade security for your data</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl">
                    📊
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-semibold">Real-time Dashboard</h3>
                    <p className="text-gray-400 text-sm mt-1">Track and monitor in real-time</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl">
                    💳
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-semibold">Multi Payment Support</h3>
                    <p className="text-gray-400 text-sm mt-1">UPI, Cards, Wallets & more</p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-center">
                  <div className="w-13 h-13 rounded-2xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#FFC400] text-3xl">
                    📈
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-semibold">High Success Rate</h3>
                    <p className="text-gray-400 text-sm mt-1">Optimized for maximum success</p>
                  </div>
                </div>
              </div>

              {/* Shield Illustration*/}
              <img
                src={bgImage}
                alt="Security"
                className="absolute w-[380px] object-contain pointer-events-none"
                style={{ right: "-22px", bottom: "85px" }}
              />
              {/* Divider line with gap below Features */}
              <div className="border-b border-[#1f1f1f] w-3/4 mt-13"></div>
              {/* Bottom */}
              <div className="mt-5 pt-2 flex items-center text-gray-300 text-xs relative z-10">
                <span className="text-[#FFC400] text-xl mr-3">
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
          <div className="flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-18">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img
                  src="/logo1.avif"
                  alt="Logo"
                  className="h-14 object-contain"
                />
              </div>

              {/* Heading */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Reset Your Password
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                  Enter your details to reset password
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5">
                {/* Username */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username {req}
                  </label>

                  <input
                    type="text"
                    value={userName}
                    maxLength={20}
                    readOnly={otpVerified}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter username"
                    className={`w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 ${otpVerified ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                  />

                  {otpSent && (
                    <span className="absolute right-4 top-[42px] text-green-600 text-xl font-bold">
                      ✓
                    </span>
                  )}
                </div>

                {/* Send OTP Button */}
                {!otpSent && !otpVerified && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full bg-[#FEC62F] hover:bg-[#FEC91F] text-white py-3 rounded-xl font-semibold"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                )}

                {/* OTP */}
                {otpSent && !otpVerified && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP {req}
                    </label>

                    <input
                      type="text"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12"
                    />
                  </div>
                )}

                {/* Verify OTP Button */}
                {otpSent && !otpVerified && (
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                )}

                {/* New Password */}
                {otpVerified && (
                  <>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password {req}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {password.length > 0 && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password {req}
                      </label>

                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20"
                        />

                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                        {confirmPassword && password === confirmPassword && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="w-full bg-[#FDBB01] hover:bg-[#FDC630] text-white py-3 rounded-xl font-semibold"
                    >
                      {loading ? "Processing..." : "Reset Password"}
                    </button>
                  </>
                )}

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
                >
                  Back to Login
                </button>
              </form>
            </div>
          </div>
        </div>

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
            {/* Right Section */}
            <div className="flex items-center justify-center py-8 px-2">
              <div>
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo1.avif"
                    alt="Logo"
                    className="h-14 object-contain"
                  />
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Reset Your Password
                  </h2>
                  <p className="text-gray-500 mt-1 text-sm">
                    Enter your details to reset password
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-5">
                  {/* Username */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username {req}
                    </label>

                    <input
                      type="text"
                      value={userName}
                      maxLength={20}
                      readOnly={otpVerified}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter username"
                      className={`w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 ${otpVerified ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                    />
                    {otpSent && (
                      <span className="absolute right-4 top-[42px] text-green-600 text-xl font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Send OTP Button */}
                  {!otpSent && !otpVerified && (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  )}

                  {/* OTP */}
                  {otpSent && !otpVerified && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OTP {req}
                      </label>
                      <input
                        type="text"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12"
                      />
                    </div>
                  )}

                  {/* Verify OTP Button */}
                  {otpSent && !otpVerified && (
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={loading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  )}

                  {/* New Password */}
                  {otpVerified && (
                    <>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password {req}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          {password.length > 0 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password {req}
                        </label>

                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20"
                          />

                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>

                          {confirmPassword && password === confirmPassword && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                      >
                        {loading ? "Processing..." : "Reset Password"}
                      </button>
                    </>
                  )}

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
                  >
                    Back to Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}