import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { X, Menu } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaIdBadge,
  FaBriefcase,
  FaCode,
  FaMobileAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  // Profile Modal
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // LocalStorage User
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // Avatar Initial
  const initials = (user.userName || "A").slice(0, 1).toUpperCase();

  // Profile API Call
  const handleProfileClick = async () => {
    try {
      setDropdownOpen(false);
      setLoading(true);
      setProfileOpen(true);
      const response = await axiosInstance.post(`/auth/Profile`);
      if (response?.respCode === 0) {
        setProfileData(response.respData);
      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // AUTO HIDE NOTIFICATION
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // NOTIFICATION CLICK
  const handleNotificationClick = () => {
    setShowNotification(true);
  };

  return (
    <>
      <header
        className="flex items-center justify-between bg-white border-b border-gray-100
        px-5 py-2 sticky top-0 z-50 shadow-sm"
      >
        {/* LEFT SIDE ============ */}
        <div className="flex items-center">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu size={22} className="text-gray-700" />
          </button>
        </div>

        {/* RIGHT SIDE=========== */}
        <div className="flex items-center gap-2">
          {/* NOTIFICATION ========== */}
          <div className="relative">
            {/* Notification Button */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0h6z"
                />
              </svg>

              {/* Notification Dot */}
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            {/* Notification Popup */}
            {showNotification && (
              <div
                className="
              fixed z-50 
              top-20 right-5 
              w-96 
              bg-white rounded-xl shadow-xl p-4
              max-sm:top-1/6
              max-sm:left-1/2 
              max-sm:right-auto
              max-sm:-translate-x-1/2 
              max-sm:-translate-y-1/2
              max-sm:w-[90%]
              bg-white border border-gray-100 rounded-xl shadow-lg p-4
            "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Congratulations! 🎉
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Congratulations! You are now a member of HelloPe.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowNotification(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/*  PROFILE SECTION =========== */}
          <div className="relative">
            {/* PROFILE HEADER */}
            <div
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg
              hover:bg-gray-50 transition"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center
                text-white font-semibold text-sm shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #facc15, #eab308)",
                }}
              >
                {initials}
              </div>

              {/* Username */}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-4">
                  {user.userName || "A"}
                </p>
                <p className="text-[10px] text-gray-400 leading-4">
                  Super Admin
                </p>
              </div>

              {/* DROPDOWN ARROW BUTTON ========= */}
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center
                w-7 h-7 rounded-full
                hover:bg-gray-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3.5 h-3.5 text-gray-500
                  transition-transform duration-200
                  ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* DROPDOWN ============== */}
            {dropdownOpen && (
              <>
                {/* Transparent Overlay */}
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Dropdown */}
                <div
                  className="absolute right-0 top-full mt-2 w-52
                  bg-white rounded-xl shadow-lg
                  border border-gray-100 p-2 z-[60]"
                >
                  {/* Profile Button */}
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3
                      px-3 py-2.5 rounded-lg
                      text-gray-700 hover:bg-gray-50
                      hover:text-gray-900 transition"
                  >
                    <div
                      className="flex items-center justify-center
                      w-9 h-9 rounded-full bg-gray-100"
                    >
                      <CgProfile className="text-xl text-gray-600" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold">
                        My Profile
                      </p>
                      <p className="text-xs text-gray-400">
                        View profile details
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* PROFILE MODAL ========================= */}
      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setProfileOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,.25)] overflow-hidden animate-[fadeIn_.25s_ease]"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-[4px] border-yellow-400 flex items-center justify-center bg-yellow-50">
                  <CgProfile className="text-yellow-500 text-2xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">User Profile</h2>
                  <p className="text-gray-500 text-xs mt-0.5">View complete account details</p>
                </div>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-9 h-9 rounded-xl border bg-white hover:bg-red-50 hover:text-red-500 transition"
              >
                <X size={18} className="mx-auto" />
              </button>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="h-9 w-9 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
                  <p className="mt-4 text-gray-500 text-sm">Loading Profile...</p>
                </div>
              ) : profileData ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <ProfileField icon={<FaUser size={18} />} label="User Name" value={profileData.userName} />
                    <ProfileField icon={<FaIdBadge size={18} />} label="User ID" value={profileData.userId} />
                    <ProfileField icon={<FaUser size={18} />} label="Full Name" value={profileData.fullName} />
                    <ProfileField icon={<FaBriefcase size={18} />} label="Designation" value={profileData.designation} />
                    <ProfileField icon={<FaCode size={18} />} label="Employee Code" value={profileData.employeeCode} />
                    <ProfileField icon={<FaMobileAlt size={18} />} label="Mobile No" value={profileData.mobileNo} />
                    <ProfileField icon={<FaUser size={18} />} label="Created By" value={profileData.createdBy} />
                    <ProfileField icon={<FaCalendarAlt size={18} />} label="Created Date" value={profileData.createdDate} />
                  </div>
                  <div className="mt-3">
                    <ProfileField
                      status
                      icon={<FaCheckCircle size={18} />}
                      label="Status"
                      value={profileData.status === "A" ? "● Active" : profileData.status}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center">
                  <CgProfile className="mx-auto text-5xl text-gray-300 mb-3" />
                  <h3 className="text-base font-semibold text-gray-500">No Profile Data Found</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  // REUSABLE PROFILE FIELD ==========
  function ProfileField({ icon, label, value, status }) {
    if (status) {
      return (
        <div className="flex items-center gap-3 rounded-xl p-3.5 bg-green-50 border border-green-100">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 flex-shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              {label}
            </p>
            <p className="text-sm font-bold text-green-600">
              {value || "-"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex items-center gap-3
        bg-white border border-gray-100
        rounded-xl p-3.5
        shadow-[0_2px_8px_rgba(0,0,0,0.03)]
        hover:border-yellow-200 hover:shadow-sm
        transition"
      >
        <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500 flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-sm font-bold text-gray-700 break-words">
            {value || "-"}
          </p>
        </div>
      </div>
    );
  }
}
