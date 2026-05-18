function AppointmentCard({ appointment }) {
  return (
    <article className="appointment-card">
      <div>
        <span className="appointment-time">{appointment.time}</span>
        <h2>{appointment.patient}</h2>
        <p>{appointment.type}</p>
      </div>

      <div>
        <small>{appointment.doctor}</small>
        <em className={`status ${appointment.status.toLowerCase()}`}>
          {appointment.status}
        </em>
      </div>
    </article>
  );
}

export default AppointmentCard;
