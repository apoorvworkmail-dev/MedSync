function PatientCard({ patient, onDelete }) {
  const statusClass =
    patient.status === "Critical"
      ? "danger"
      : patient.status === "Review" || patient.status === "Recovering"
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
          ID: {patient.id} - Last visit: {patient.lastVisit || 'N/A'}
        </small>
      </div>
      <div className="patient-actions">
        <em className={statusClass}>{patient.status}</em>
        {onDelete && (
          <button onClick={() => onDelete(patient.id)}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

export default PatientCard;
