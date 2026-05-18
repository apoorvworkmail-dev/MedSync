import DashboardLayout from "../layouts/DashboardLayout";

const doctors = [
  { name: "Dr. Sarah Johnson", specialty: "General Medicine", patients: 128, availability: "Available" },
  { name: "Dr. Arjun Mehta", specialty: "Cardiology", patients: 96, availability: "In Surgery" },
  { name: "Dr. Neha Rao", specialty: "Neurology", patients: 74, availability: "Available" },
  { name: "Dr. Kabir Singh", specialty: "Orthopedics", patients: 83, availability: "On Leave" },
];

function Doctors() {
  return (
    <DashboardLayout title="Doctors" subtitle="Manage medical staff, specialties, and availability.">
      <section className="resource-grid">
        {doctors.map((doctor) => (
          <article className="resource-card doctor-card" key={doctor.name}>
            <span className="resource-avatar">{doctor.name.split(" ")[1].charAt(0)}</span>
            <div>
              <h2>{doctor.name}</h2>
              <p>{doctor.specialty}</p>
              <small>{doctor.patients} active patients</small>
            </div>
            <em className={doctor.availability === "Available" ? "success" : doctor.availability === "In Surgery" ? "warning" : "danger"}>
              {doctor.availability}
            </em>
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}

export default Doctors;
