function PatientCard({ patient, onEdit, onDelete }) {
  return (
    <div className="resource-card">

      <div className="resource-avatar">
        {patient.name?.charAt(0).toUpperCase()}
      </div>

      <div>
        <h2>{patient.name}</h2>

        <p>
          <strong>Status:</strong> {patient.status}
        </p>

        <p>
          <strong>Age:</strong> {patient.age}
        </p>

        <p>
          <strong>Disease:</strong>{" "}
          {patient.disease || patient.condition}
        </p>

        <p>
          <strong>Doctor:</strong>{" "}
          {patient.doctor || "Not Assigned"}
        </p>
      </div>

      <div className="patient-actions">
        <button onClick={() => onEdit(patient)}>
          Edit
        </button>

        <button onClick={() => onDelete(patient.id)}>
          Delete
        </button>
      </div>

    </div>
  );
}

export default PatientCard;
