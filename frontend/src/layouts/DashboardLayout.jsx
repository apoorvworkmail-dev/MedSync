import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";

function DashboardLayout({ children, title, subtitle }) {
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