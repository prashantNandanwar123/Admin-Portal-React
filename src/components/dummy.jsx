import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosLink } from "react-icons/io";
import { useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  ShieldCheck,
  Key,
  BarChart2,
  Menu,
  Shield,
  LogOut,
  ChevronDown,
  ChevronRight,
  Cpu,
  User,
  UserCog,
  Home,
  Folder,
  Settings,
  Moon,
  Sun,
  Palette,
} from "lucide-react";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const location = useLocation();

  const isUpiActive =
    location.pathname === "/app/upi-payment-processor";

  const isUserMenuActive =
    location.pathname === "/app/users" ||
    location.pathname === "/app/roles";

  const [masterOpen, setMasterOpen] = useState(false);
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [activeMenu, setActiveMenu] = useState("");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(JSON.parse(localStorage.getItem("user")));

  const roleFunctions = (userData.role_function || "")
    .split(",")
    .map((r) => r.trim());

  const hasAccess = (userName) =>
    roleFunctions.includes(userName);

  const getMenuClass = (menu) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${activeMenu === menu
      ? "bg-white text-black"
      : isLightSidebar
        ? "text-black hover:bg-black/10"
        : "text-white/60 hover:bg-white/10"
    }`;

  const menuConfig = [
    {
      title: "Dashboard",
      path: "/app/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Merchant Registration",
      path: "/app/register-merchant",
      icon: UserPlus,
    },
    {
      title: "Risk Approval",
      path: "/app/risk-approval",
      icon: ShieldCheck,
    },
    {
      title: "Merchant View / Edit",
      path: "/app/merchants",
      icon: Users,
    },
    {
      title: "Merchant Crediential",
      path: "/app/merchant-credential",
      icon: Key,
    },
    {
      title: "Merchant Webhook",
      path: "/app/merchant-webhook",
      icon: IoIosLink,
    },
    {
      title: "Report",
      path: "/app/reports",
      icon: BarChart2,
    },
  ];

  const otherMenuActive =
    masterOpen || userMgmtOpen;  //Logical OR Operator

  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarColor, setSidebarColor] = useState();

  const isLightSidebar =
    sidebarColor === "#ffffff" ||
    sidebarColor === "#ffffff" ||
    sidebarColor === "#fff";

  const activeBgColor = isLightSidebar
    ? "#facc15"
    : "#ffffff";

  const activeTextColor = isLightSidebar
    ? "#ffffff"
    : "#000000";

  const activeMenuClass = "font-semibold";

  const menuClass = (isActive) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive
      ? activeMenuClass
      : isLightSidebar
        ? "text-black hover:text-black hover:bg-black/10"
        : "text-white/60 hover:text-white hover:bg-white/10"
    }`;

  // Dark-Light Mode Function
  useEffect(() => {
    if (darkMode) {
      setSidebarColor("#1a1d2e");
    } else {
      setSidebarColor("#ffffff");
    }
  }, [darkMode]);

  localStorage.removeItem("sidebarColor");
  const showOtherSection =
    roleFunctions.includes("Master") ||
    roleFunctions.includes("User Management");



  //  Merchant Registration ke liye alag class — color class nahi lagegi
  // taaki inline style override ho sake
  const merchantMenuClass = (isActive) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition font-semibold ${isActive
      ? ""
      : isLightSidebar
        ? "text-black hover:text-black hover:bg-black/10"
        : "text-white/60 hover:text-white hover:bg-white/10"
    }`;

  const buttonClass = `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${isLightSidebar
    ? "text-black hover:text-black hover:bg-black/10"
    : "text-white/60 hover:text-white hover:bg-white/10"
    }`;


  const activeMenuStyle = {
    backgroundColor: activeBgColor,
    color: activeTextColor,
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");

      if (response.respCode === 0) {

        localStorage.removeItem("isLogin");
        localStorage.removeItem("user");

        toast.success(response.respMsg);

        setTimeout(() => {
          navigate("/");
        }, 200);
      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error);

      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");

      window.location.href = "/";
    }
  };

  return (
    <aside
      ref={sidebarRef}
      style={{ backgroundColor: sidebarColor }}
      className={`
        fixed top-0 left-0 h-full z-30
        ${open ? "w-64" : "w-20"}
        ${isLightSidebar ? "text-black" : "text-white"}
        flex flex-col
        transition-all duration-300
        shadow-2xl
        backdrop-blur-xl
        border-r
        ${isLightSidebar ? "border-black/10" : "border-white/10"}
      `}
    >
      {/* Header */}
      <div
        className={`px-4 py-5 flex items-center justify-between border-b ${isLightSidebar ? "border-black/10" : "border-white/10"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-400 text-xl rounded-full flex items-center justify-center font-bold text-[#1a1d2e]">
            H
          </div>
          {open && (
            <div>
              <h2 className="font-bold text-lg block">HelloPe</h2>
              <p
                className={`text-xs ${isLightSidebar ? "text-black/80" : "text-white/60"
                  }`}
              >
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4">
        {/* MAIN MENU */}
        {open && (
          <div
            className={`px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase flex items-center gap-2 ${isLightSidebar ? "text-black/80" : "text-white/40"
              }`}
          >
            <Home size={12} />
            MAIN MENU
          </div>
        )}

        <div className="space-y-1 mb-5">
          {menuConfig
            .filter((menu) => roleFunctions.includes(menu.title))
            .map((menu) => {
              const Icon = menu.icon;

              return (
                <NavLink
                  key={menu.title}
                  to={menu.path}
                  onClick={() => {
                    setActiveSection("main");
                    setMasterOpen(false);
                    setUserMgmtOpen(false);
                  }}
                  className={getMenuClass(menu.title)}

                  onClick={() => {
                    setActiveMenu(menu.title);

                    setMasterOpen(false);
                    setUserMgmtOpen(false);
                  }}
                >
                  <Icon size={18} />
                  {open && <span>{menu.title}</span>}
                </NavLink>
              );
            })}

          {/* OTHER */}
          {open && showOtherSection && (
            <div
              className={`px-3 mb-2 mt-4 text-[11px] font-semibold tracking-wider uppercase flex items-center gap-2 ${isLightSidebar ? "text-black/80" : "text-white/40"
                }`}
            >
              <Folder size={12} />
              OTHER
            </div>
          )}

          {/* MASTER */}
          {roleFunctions.includes("Master") && (
            <div>
              <button
                onClick={() => {
                  setMasterOpen(!masterOpen);
                  setUserMgmtOpen(false);
                  setActiveMenu("master");
                }}

                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition
                     ${activeMenu === "master"
                    ? "bg-white text-black"
                    : isLightSidebar
                      ? "text-black hover:bg-black/10"
                      : "text-white/60 hover:bg-white/10"
                  }
               `}
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} />
                  {open && <span>Master</span>}
                </div>

                {open &&
                  (masterOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </button>

              {masterOpen && open && (
                <div className="ml-8 mt-1 space-y-1">
                  <NavLink
                    to="/app/upi-payment-processor"
                    onClick={() => setActiveMenu("upi")}
                    className={getMenuClass("upi")}
                  >
                    <Cpu size={16} />
                    <span>UPI Payment Processor</span>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* USER MANAGEMENT */}
          {roleFunctions.includes("User Management") && (
            <div>
              <button
                onClick={() => {
                  setUserMgmtOpen(!userMgmtOpen);
                  setMasterOpen(false);
                  setActiveMenu("user-management");
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition
        ${activeMenu === "user-management"
                    ? "bg-white text-black"
                    : isLightSidebar
                      ? "text-black hover:bg-black/10"
                      : "text-white/60 hover:bg-white/10"
                  }
      `}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  {open && <span>User Management</span>}
                </div>

                {open &&
                  (userMgmtOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </button>

              {userMgmtOpen && open && (
                <div className="ml-8 mt-1 space-y-1">

                  {/* All User */}
                  <NavLink
                    to="/app/users"
                    onClick={() => setActiveMenu("all-user")}
                    className={getMenuClass("all-user")}
                  >
                    <User size={16} />
                    <span>All User</span>
                  </NavLink>

                  {/* Role & Access */}
                  <NavLink
                    to="/app/roles"
                    onClick={() => setActiveMenu("role-access")}
                    className={getMenuClass("role-access")}
                  >
                    <UserCog size={16} />
                    <span>Role & Access</span>
                  </NavLink>

                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* SETTINGS */}
      <div
        className={`px-3 py-3 border-t ${isLightSidebar ? "border-black/10" : "border-white/10"
          }`}
      >
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isLightSidebar ? "hover:bg-black/10" : "hover:bg-white/10"
            }`}
        >
          <Settings size={18} />
          {open && <span>Settings</span>}
        </button>

        {showSettings && open && (
          <div
            className={`mt-3 space-y-4 p-3 rounded-xl ${isLightSidebar ? "bg-black/5" : "bg-white/5"
              }`}
          >
            {/* DARK MODE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}

                <span className="text-sm">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1 rounded-md bg-yellow-400 text-black text-xs font-semibold"
              >
                Toggle
              </button>
            </div>

            {/* SIDEBAR COLOR */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette size={16} />
                <span className="text-sm">Sidebar Color</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {[
                  "#1a1d2e",
                  "#1e293b",
                  "#312e81",
                  "#7c2d12",
                  "#14532d",
                  "#831843",
                  "#ffffff",
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSidebarColor(color)}
                    className={`w-7 h-7 rounded-full border-2 ${isLightSidebar ? "border-black/20" : "border-white"
                      }`}
                    style={{
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <div
        className={`p-3 border-t ${isLightSidebar ? "border-black/10" : "border-white/10"
          }`}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={18} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}