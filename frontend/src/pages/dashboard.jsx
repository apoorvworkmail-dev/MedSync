import ActivityFeed from "../components/Dashboard/ActivityFeed";
import AnalyticsChart from "../components/Dashboard/AnalyticsChart";
import LiveMonitoring from "../components/Dashboard/LiveMonitoring";
import RecentPatients from "../components/Dashboard/RecentPatients";
import StatsCards from "../components/Dashboard/StatsCards";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout
      title="Welcome back, Dr. Sarah Johnson"
      subtitle="Here's what's happening with your practice today."
    >
      <StatsCards />

      <div className="dashboard-grid">
        <RecentPatients />
        <AnalyticsChart />
        <LiveMonitoring />
        <ActivityFeed />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
