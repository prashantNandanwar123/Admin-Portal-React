import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-visible grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="bg-orange-500 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Reset Your Password
          </h1>
          <p className="text-orange-100 text-lg mb-8">
            Secure your account by creating a strong new password.
          </p>
          <div className="space-y-5 text-base">
            <div className="flex items-center gap-3">
              <span>🔒</span>
              <span>Advanced account protection</span>
            </div>
            <div className="flex items-center gap-3">
              <span>⚡</span>
              <span>Fast and secure reset process</span>
            </div>

            <div className="flex items-center gap-3">
              <span>🛡️</span>
              <span>Encrypted password management</span>
            </div>

            <div className="flex items-center gap-3">
              <span>📱</span>
              <span>Accessible on all devices</span>
            </div>
          </div>

          <div className="mt-10 text-sm text-orange-100">
            Trusted secure authentication system
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

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
  );
}