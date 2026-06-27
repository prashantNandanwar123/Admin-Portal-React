import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    console.log("Reset password l;oactin-->>>", location)
    console.log("Reset password l;oactin-->>>", location.state)


    const userName = location.state?.userName;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // useEffect(() => {
    //     if (!userName) {
    //         navigate("/forgot-password");
    //     }
    // }, [userName, navigate]);

    const passwordValidation = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isPasswordValid =
        passwordValidation.length &&
        passwordValidation.uppercase &&
        passwordValidation.lowercase &&
        passwordValidation.number &&
        passwordValidation.special;

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
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="flex justify-center mb-6">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="h-14 object-contain"
                    />
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Reset Password
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Create your new password
                    </p>
                </div>

                <form
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                >
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password {req}
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                maxLength={20}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password {req}
                        </label>

                        <div className="relative">
                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                maxLength={20}
                                disabled={!isPasswordValid}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm password"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
                    >
                        {loading
                            ? "Processing..."
                            : "Reset Password"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full border border-gray-300 py-3 rounded-xl"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}