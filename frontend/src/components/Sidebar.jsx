import { NavLink } from "react-router-dom";

function Sidebar({ darkMode }) {
  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium";

  return (
    <div
      className={`w-64 min-h-screen p-5 border-r ${
        darkMode
          ? "bg-gray-900 border-gray-800 text-white"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
          M
        </div>

        <h1 className="text-2xl font-bold">
          MedSync
        </h1>
      </div>

      <nav className="space-y-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
            D
          </span>
          Dashboard
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
            P
          </span>
          Patients
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
            A
          </span>
          Appointments
        </NavLink>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs">
            DR
          </span>
          Doctors
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
            R
          </span>
          Reports
        </NavLink>

        <NavLink
          to="/ai-assistant"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs">
            AI
          </span>
          AI Assistant
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`
          }
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
            S
          </span>
          Settings
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;