function DashboardNavbar({ title = "Dashboard", subtitle = "Here's what's happening with your practice today." }) {
  return (
    <header className="dashboard-navbar">
      <div>
        <p>{subtitle}</p>
        <h1>{title}</h1>
      </div>

      <div className="dashboard-tools">
        <label className="dashboard-search">
          <span>Search</span>
          <input type="search" placeholder="Search..." />
        </label>

        <button className="notification-btn" type="button" aria-label="Notifications">
          N
        </button>

        <div className="doctor-profile" aria-label="Signed in as Dr. Sarah Johnson">
          SJ
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
