function AnalyticsChart() {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <h2>Patient Overview</h2>
        <select defaultValue="month" aria-label="Chart range">
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      <div className="analytics-chart">
        <span style={{ height: "42%" }} />
        <span style={{ height: "58%" }} />
        <span style={{ height: "49%" }} />
        <span style={{ height: "72%" }} />
        <span style={{ height: "61%" }} />
        <span style={{ height: "80%" }} />
        <span style={{ height: "68%" }} />
        <span style={{ height: "88%" }} />
      </div>
    </section>
  );
}

export default AnalyticsChart;
