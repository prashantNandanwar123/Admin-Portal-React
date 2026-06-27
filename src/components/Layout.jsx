import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Menu } from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  //  toggle (not just close)
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/*  Sidebar */}
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
      {/* Floating Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="
                  fixed
                  top-5
                  z-50
                  w-8
                  h-8
                  rounded-xl
                  bg-gray-300             
                  top: 3%;
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  hover:scale-100
                "
        style={{
          left: sidebarOpen ? "253px" : "68px",
          transform: "translateX(-35%)",
        }}
      >
        <Menu size={18} />
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
      >
        {/*  Navbar (no toggle needed now) */}
        <Navbar />

        <main className="flex-1 overflow-y-auto hide-scrollbar p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}