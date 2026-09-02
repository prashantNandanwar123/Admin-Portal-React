import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

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
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Page Content */}
        <main
           className="
           pt-16
           h-screen
           overflow-y-auto
           hide-scrollbar
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}