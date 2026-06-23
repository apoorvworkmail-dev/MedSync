import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  const groupedDoctors = doctors.reduce((acc, doctor) => {
    const dept = doctor.specialization || "General";

    if (!acc[dept]) {
      acc[dept] = [];
    }

    acc[dept].push(doctor);

    return acc;
  }, {});
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <DashboardLayout
      title="Doctors"
      subtitle="Manage medical staff, specialties, and availability."
    >
      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>No doctors found.</div>
      ) : (
        <>
          {Object.entries(groupedDoctors).map(
            ([department, doctorsList]) => (
              <div key={department}>

                <h2
                  style={{
                    marginTop: "30px",
                    marginBottom: "15px",
                    color: "#2563eb",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  {department}
                </h2>

                <section className="resource-grid">

                  {doctorsList.map((doctor) => (
                    <article
                      className="resource-card doctor-card"
                      key={doctor._id}
                    >
                      <span className="resource-avatar">
                        {doctor.name?.replace(/^Dr\.\s*/, "").charAt(0).toUpperCase() || "D"}
                      </span>

                      <div>

                        <h3>{doctor.name}</h3>

                        <p>
                          {doctor.specialization}
                        </p>

                        <small>
                          Experience:
                          {" "}
                          {doctor.experience}
                          {" "}
                          Years
                        </small>

                        <br />

                        <small>
                          Consultation Fee:
                          {" "}
                          ₹{doctor.fees}
                        </small>

                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          alignItems: "flex-end",
                        }}
                      >
                        <em
                          className={
                            doctor.availability === "Available"
                              ? "success"
                              : "warning"
                          }
                        >
                          {doctor.availability}
                        </em>

                        <button
                          onClick={() =>
                            navigate("/appointments")
                          }
                          style={{
                            padding: "8px 14px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          Book Appointment
                        </button>
                      </div>

                    </article>
                  ))}

                </section>

              </div>
            )
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default Doctors;
