import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "D" },
    { to: "/patients", label: "Patients", icon: "P" },
    { to: "/appointments", label: "Appointments", icon: "A" },
    { to: "/doctors", label: "Doctors", icon: "DR" },
    { to: "/reports", label: "Reports", icon: "R" },
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
    </aside>
  );
}

export default Sidebar;
