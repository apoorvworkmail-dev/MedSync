import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "doctor"
      ? "/doctor"
      : user?.role === "patient"
        ? "/patient"
        : "/dashboard";

  const links = [
    { to: dashboardPath, label: "Dashboard", icon: "D" },
    { to: "/patients", label: "Patients", icon: "P" },
    { to: "/appointments", label: "Appointments", icon: "A" },
    { to: "/doctors", label: "Doctors", icon: "DR" },
    { to: "/reports", label: "Reports", icon: "R" },
    { to: "/ai-assistant", label: "AI Assistant", icon: "AI" },
    { to: "/settings", label: "Settings", icon: "S" },
  ];

  return (
    <aside className="app-sidebar">
      <NavLink to="/" className="app-sidebar-logo">
        <span>M</span>
        MedSync
      </NavLink>

      <nav className="app-sidebar-nav">
        {links.map((link) => (
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            key={link.to}
            to={link.to}
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "12px 14px",
          background: "rgba(239, 68, 68, 0.08)",
          color: "#ef4444",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "800",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "14px"
        }}
      >
        <span style={{
          display: "grid",
          width: "28px",
          height: "28px",
          placeItems: "center",
          borderRadius: "8px",
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          fontSize: "12px"
        }}>🔓</span>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
