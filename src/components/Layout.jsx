import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Menu } from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`
        fixed
        top-5
        z-50
        w-8
        h-8
        rounded-xl
        bg-gray-300
        flex
        items-center
        justify-center
        transition-all
        duration-300
        hover:scale-105
        ${isMobile ? "left-4" : ""}
        `}
        style={
          !isMobile
            ? {
              left: sidebarOpen ? "253px" : "68px",
              transform: "translateX(-35%)",
            }
            : {}
        }
      >
        <Menu size={18} />
      </button>
      {/* Main Area */}
      <div
        className={`
          h-screen
          transition-all
          duration-300
          overflow-hidden
         ${isMobile
            ? "ml-0"
            : sidebarOpen
              ? "lg:ml-64"
              : "lg:ml-20"
          }
        `}
      >

        {/* Fixed Navbar */}
        <div
          className={`
            fixed
            top-0
            right-0
            z-40
            h-16
            transition-all
            duration-300
           ${isMobile
              ? "left-0"
              : sidebarOpen
                ? "lg:left-64"
                : "lg:left-20"
            }
          `}
        >
          <Navbar />
        </div>

        {/* Page Content */}
        <main
          className="/*  */
            h-screen
            overflow-y-auto
            pt-16
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}