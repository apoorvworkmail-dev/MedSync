import AnalyticsChart from "../components/Dashboard/AnalyticsChart";
import DashboardCard from "../components/DashboardCard";
import DashboardLayout from "../layouts/DashboardLayout";

function Reports() {
  return (
    <DashboardLayout title="Reports" subtitle="Review performance, revenue, and patient activity trends.">
      <div className="card-container reports-summary">
        <DashboardCard title="Monthly Revenue" value="$45,231" detail="+15% from last month" tone="green" />
        <DashboardCard title="Patient Growth" value="18%" detail="+4% this week" tone="blue" />
        <DashboardCard title="Completion Rate" value="94%" detail="Appointments completed" tone="purple" />
        <DashboardCard title="Open Tasks" value="14" detail="5 high priority" tone="orange" />
      </div>

      <div className="dashboard-grid single-focus">
        <AnalyticsChart />
        <section className="dashboard-panel">
          <div className="panel-heading">
            <h2>Report Categories</h2>
          </div>
          <ul className="activity-feed">
            <li><span>1</span><p>Patient visit summary</p></li>
            <li><span>2</span><p>Revenue and billing analysis</p></li>
            <li><span>3</span><p>Doctor productivity report</p></li>
            <li><span>4</span><p>Appointment completion report</p></li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
