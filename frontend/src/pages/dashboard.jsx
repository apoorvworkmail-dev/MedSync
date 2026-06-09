import DashboardLayout from "../layouts/DashboardLayout";
import StatsCards from "../components/Dashboard/StatsCards";
import RecentPatients from "../components/Dashboard/RecentPatients";
import AnalyticsChart from "../components/Dashboard/AnalyticsChart";
import LiveMonitoring from "../components/Dashboard/LiveMonitoring";
import ActivityFeed from "../components/Dashboard/ActivityFeed";

function Dashboard() {
  return (
    <DashboardLayout>
      <StatsCards />

      <section className="dashboard-grid">
        <RecentPatients />
        <AnalyticsChart />
      </section>

      <section className="dashboard-grid">
        <LiveMonitoring />
        <ActivityFeed />
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;