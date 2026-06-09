import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { Outlet } from "react-router-dom";

function DashboardLayout() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add("dark");

      document.body.style.backgroundColor = "#111827";

      localStorage.setItem("theme", "dark");

    } else {

      document.documentElement.classList.remove("dark");

      document.body.style.backgroundColor = "#f3f4f6";

      localStorage.setItem("theme", "light");
    }

  }, [darkMode]);

  return (

    <div
      className={`flex h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;