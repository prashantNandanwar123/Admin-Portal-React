import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { LogOut, X } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  // LocalStorage User
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Avatar Initial
  const initials = (user.userName || "A")
    .slice(0, 1)
    .toUpperCase();

  // Profile API Call
  const handleProfileClick = async () => {
    try {
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

  return (
    <>
      {/* Navbar */}
      <header
        className="flex justify-end items-center lg:mx-[22px] mx-2 mt-4 rounded-xl px-4 py-2 sticky top-0 z-50"
        style={{
          background:
            "linear-gradient(135deg, #75acf4 0%, #f0fdf4 100%)",
        }}
      >
        <div className="flex items-center">
          {/* Profile Button */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-blue-100"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                background:
                  "linear-gradient(135deg, #f38537, #fb923c)",
              }}
            >
              {initials}
            </div>

            {/* Username */}
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user.userName || "A"}
            </span>
            <div>
            </div>
          </button>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-blue-100"
          >
            <div>
              {/* Profile Icon */}
              <CgProfile className="text-2xl text-black-600" />
            </div>
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          {/* Modal Box */}
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden animate-[fadeIn_.3s_ease]">
            {/* Header */}
            <div
              className="relative px-6 py-5 flex items-center justify-between"
              style={{
                background:
                  "linear-gradient(135deg, #2563eb 0%, #60a5fa 50%, #93c5fd 100%)",
              }}
            >
              <div className="flex items-center gap-4">

                {/* Profile Avatar */}
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center shadow-lg">
                  <CgProfile className="text-white text-4xl" />
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    User Profile
                  </h2>

                  <p className="text-blue-100 text-sm">
                    View complete account details
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setProfileOpen(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition duration-300"
              >
                <X size={22} className="text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 bg-gradient-to-b from-white to-blue-50">

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />

                  <p className="text-gray-500 text-sm animate-pulse">
                    Loading Profile...
                  </p>
                </div>
              ) : profileData ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* User Name */}
                  <ProfileField
                    icon="👤"
                    label="User Name"
                    value={profileData.userName}
                  />

                  {/* User ID */}
                  <ProfileField
                    icon="🆔"
                    label="User ID"
                    value={profileData.userId}
                  />

                  {/* Full Name */}
                  <ProfileField
                    icon="📛"
                    label="Full Name"
                    value={profileData.fullName}
                  />

                  {/* Designation */}
                  <ProfileField
                    icon="💼"
                    label="Designation"
                    value={profileData.designation}
                  />

                  {/* Employee Code */}
                  <ProfileField
                    icon="🏢"
                    label="Employee Code"
                    value={profileData.employeeCode}
                  />

                  {/* Mobile */}
                  <ProfileField
                    icon="📱"
                    label="Mobile No"
                    value={profileData.mobileNo}
                  />

                  {/* Created By */}
                  <ProfileField
                    icon="🛠️"
                    label="Created By"
                    value={profileData.createdBy}
                  />

                  {/* Created Date */}
                  <ProfileField
                    icon="📅"
                    label="Created Date"
                    value={profileData.createdDate}
                  />

                  {/* Status */}
                  <ProfileField
                    icon="🟢"
                    label="Status"
                    value={
                      profileData.status === "A"
                        ? "Active"
                        : profileData.status
                    }
                  />
                </div>
              ) : (
                <div className="text-center py-14">
                  <CgProfile className="text-6xl text-gray-300 mx-auto mb-4" />

                  <p className="text-gray-500 text-lg font-medium">
                    No Profile Data Found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reusable Field Component
function ProfileField({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-700 break-words">
        {value || "-"}
      </p>
    </div>
  );
}