const patients = [
  { name: "John Doe", detail: "General Checkup", time: "09:00 AM", status: "Confirmed" },
  { name: "Jane Smith", detail: "Follow-up", time: "10:30 AM", status: "Confirmed" },
  { name: "Mike Johnson", detail: "Consultation", time: "02:00 PM", status: "Pending" },
  { name: "Priya Sharma", detail: "Lab Review", time: "04:15 PM", status: "Confirmed" },
];

function RecentPatients() {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <h2>Recent Appointments</h2>
        <button type="button">View All</button>
      </div>

      <div className="patient-list">
        {patients.map((patient) => (
          <article className="patient-item" key={`${patient.name}-${patient.time}`}>
            <span className="patient-initial">{patient.name.charAt(0)}</span>
            <div>
              <h3>{patient.name}</h3>
              <p>{patient.detail}</p>
            </div>
            <strong>{patient.time}</strong>
            <em className={patient.status === "Confirmed" ? "success" : "warning"}>
              {patient.status}
            </em>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecentPatients;
