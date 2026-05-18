const vitals = [
  { label: "Heart Rate", value: "72 bpm" },
  { label: "Blood Pressure", value: "120/80" },
  { label: "Oxygen Level", value: "98%" },
  { label: "Temperature", value: "98.6F" },
];

function LiveMonitoring() {
  return (
    <section className="dashboard-panel live-monitoring">
      <div className="panel-heading">
        <h2>Live Monitoring</h2>
        <span className="live-badge">Live</span>
      </div>

      <div className="body-scan" aria-hidden="true">
        <div className="scan-head" />
        <div className="scan-body" />
      </div>

      <div className="vital-list">
        {vitals.map((vital) => (
          <div key={vital.label}>
            <span>{vital.label}</span>
            <strong>{vital.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveMonitoring;
