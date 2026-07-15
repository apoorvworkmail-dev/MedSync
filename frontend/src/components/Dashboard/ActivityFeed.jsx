const activities = [
  "New patient record added for Chirag Gandhi",
  "Dr. Mehta confirmed 3 appointments",
  "Lab report uploaded for Jane Smith",
  "System backup completed successfully",
];

function ActivityFeed() {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <h2>Activity Feed</h2>
      </div>

      <ul className="activity-feed">
        {activities.map((activity, index) => (
          <li key={activity}>
            <span>{index + 1}</span>
            <p>{activity}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ActivityFeed;
