const stats = [
  { label: "Total Patients", value: "2,543", change: "+12% from last month", tone: "blue" },
  { label: "Today's Appointments", value: "28", change: "+8% from yesterday", tone: "green" },
  { label: "Total Revenue", value: "$45,231", change: "+15% from last month", tone: "purple" },
  { label: "Pending Tasks", value: "14", change: "+5 from yesterday", tone: "orange" },
];

function StatsCards() {
  return (
    <section className="dashboard-stats">
      {stats.map((stat) => (
        <article className="metric-card" key={stat.label}>
          <span className={`metric-icon ${stat.tone}`}>{stat.label.charAt(0)}</span>
          <div>
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
            <small>{stat.change}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

export default StatsCards;
