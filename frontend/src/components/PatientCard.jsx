function PatientCard({ patient }) {
  const statusClass =
    patient.status === "Critical"
      ? "danger"
      : patient.status === "Review"
        ? "warning"
        : "success";

  return (
    <article className="resource-card">
      <span className="resource-avatar">{patient.name.charAt(0)}</span>
      <div>
        <h2>{patient.name}</h2>
        <p>
          {patient.age} years - {patient.condition}
        </p>
        <small>
          ID: {patient.id} - Last visit: {patient.lastVisit}
        </small>
      </div>
      <em className={statusClass}>{patient.status}</em>
    </article>
  );
}

export default PatientCard;
