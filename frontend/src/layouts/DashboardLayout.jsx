import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";

function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <DashboardNavbar title={title} subtitle={subtitle} />
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
