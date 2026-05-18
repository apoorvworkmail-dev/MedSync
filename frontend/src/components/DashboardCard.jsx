function DashboardCard({ title, value, detail, tone = "blue" }) {
  return (
    <article className="dashboard-card">
      <span className={`metric-icon ${tone}`}>{title.charAt(0)}</span>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        {detail && <small>{detail}</small>}
      </div>
    </article>
  );
}

export default DashboardCard;
