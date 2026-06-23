import { Bell, Search } from "lucide-react";

const DashboardNavbar = ({ title, subtitle }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Format role for display: doctor -> Doctor, patient -> Patient, admin -> Admin, etc.
  const formattedRole = user.role 
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1) 
    : "Staff";

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {title || "MedSync Dashboard"}
        </h1>

        <p className="text-gray-500 text-sm">
          {subtitle || "Monitor hospital activities in real-time"}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl">
          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm"
          />
        </div>

        {/* Notification */}
        <div className="relative bg-gray-100 p-3 rounded-xl cursor-pointer">
          <Bell size={20} />

          <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-xl">
          <img
            src="https://i.pravatar.cc/40"
            alt="user-avatar"
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h2 className="text-sm font-semibold">
              {user.name || "User"}
            </h2>

            <p className="text-xs text-gray-500">
              {formattedRole}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardNavbar;