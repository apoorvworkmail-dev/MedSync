import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

const dummyDoctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    patients: 128,
    availability: "Available",
  },
  {
    name: "Dr. Arjun Mehta",
    specialty: "Cardiology",
    patients: 96,
    availability: "In Surgery",
  },
  {
    name: "Dr. Neha Rao",
    specialty: "Neurology",
    patients: 74,
    availability: "Available",
  },
  {
    name: "Dr. Kabir Singh",
    specialty: "Orthopedics",
    patients: 83,
    availability: "On Leave",
  },
];

function Doctors() {
  const [doctors, setDoctors] = useState(dummyDoctors);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.doctors) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <DashboardLayout
      title="Doctors"
      subtitle="Manage medical staff, specialties, and availability."
    >
      <section className="resource-grid">
        {doctors.map((doctor) => (
          <article
            className="resource-card doctor-card"
            key={doctor._id || doctor.name}
          >
            <span className="resource-avatar">
              {doctor.name?.split(" ")[1]?.charAt(0) || "D"}
            </span>

            <div>
              <h2>{doctor.name}</h2>

              <p>
                {doctor.specialty || doctor.specialization}
              </p>

              <small>
                {doctor.patients || 0} active patients
              </small>
            </div>

            <em
              className={
                doctor.availability === "Available"
                  ? "success"
                  : doctor.availability === "In Surgery"
                  ? "warning"
                  : "danger"
              }
            >
              {doctor.availability || "Available"}
            </em>
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}

export default Doctors;
