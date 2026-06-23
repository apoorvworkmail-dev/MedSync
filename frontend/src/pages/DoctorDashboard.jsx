import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import AppointmentCard from "../components/AppointmentCard";
import API from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const formatAppointmentDate = (value) => {
  if (!value) return "Date not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date not set" : date.toLocaleDateString();
};

const normalizeAppointment = (appointment) => ({
  id: appointment._id || appointment.id,
  patient: appointment.patient?.name || appointment.patientName || "Unknown patient",
  doctor: appointment.doctor?.name || "Unassigned doctor",
  date: formatAppointmentDate(appointment.appointmentDate),
  type: appointment.reason || "General visit",
  time: appointment.appointmentTime || appointment.time || "Time not set",
  status: appointment.status || "Pending",
});

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [appointmentsRes, patientsRes] = await Promise.all([
          API.get("/appointments/my", { headers }),
          API.get("/patients", { headers }),
        ]);

        if (appointmentsRes.data.appointments) {
          setAppointments(appointmentsRes.data.appointments.map(normalizeAppointment));
        }
        if (patientsRes.data.patients) {
          setPatients(patientsRes.data.patients);
        }
      } catch (error) {
        console.error("DoctorDashboard loading error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Appointment cancelled successfully");
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <DashboardLayout 
      title="Doctor Workspace" 
      subtitle="Manage your schedule, evaluate patient logs, and access AI diagnostics."
    >
      <div className="card-container reports-summary">
        <DashboardCard 
          title="Today's Appointments" 
          value={appointments.filter(a => a.status !== "Cancelled").length.toString()} 
          detail="Active scheduled slots" 
          tone="blue" 
        />
        <DashboardCard 
          title="Total Patient Records" 
          value={patients.length.toString()} 
          detail="Registered in database" 
          tone="green" 
        />
        <DashboardCard 
          title="AI Insights Ready" 
          value="99%" 
          detail="Diagnostic accuracy rating" 
          tone="purple" 
        />
        <DashboardCard 
          title="Awaiting Reviews" 
          value={appointments.filter(a => a.status === "Pending").length.toString()} 
          detail="Requires follow-up" 
          tone="orange" 
        />
      </div>

      <div className="dashboard-grid">
        {/* Appointments List */}
        <section className="dashboard-panel">
          <header className="panel-heading">
            <h2>Your Appointments</h2>
            <Link to="/appointments" className="view-all-link" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
              Manage All
            </Link>
          </header>

          {loading ? (
            <p className="empty-state">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="empty-state">No appointments scheduled for you.</p>
          ) : (
            <div className="appointment-grid" style={{ gridTemplateColumns: "1fr", gap: "16px" }}>
              {appointments.slice(0, 3).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))}
            </div>
          )}
        </section>

        {/* Patients Summary */}
        <section className="dashboard-panel">
          <header className="panel-heading">
            <h2>Recent Patients</h2>
            <Link to="/patients" className="view-all-link" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
              View Directory
            </Link>
          </header>

          {loading ? (
            <p className="empty-state">Loading patient records...</p>
          ) : patients.length === 0 ? (
            <p className="empty-state">No patients assigned to you.</p>
          ) : (
            <ul className="activity-feed">
              {patients.slice(0, 5).map((patient, index) => (
                <li key={patient._id || index}>
                  <span className="blue" style={{ borderRadius: "50%", padding: "8px", fontWeight: "bold" }}>
                    {patient.name.charAt(0)}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{patient.name}</p>
                    <small style={{ color: "#666" }}>
                      Age: {patient.age} • {patient.disease || "No listed disease"} ({patient.status || "Stable"})
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick Access to AI Assistant */}
      <section className="dashboard-panel" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Need Clinical Support?</h3>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
              Use our built-in AI Health Assistant to summarize medical terminology, translate reports, or check medication details.
            </p>
          </div>
          <Link to="/ai-assistant" className="btn btn-primary" style={{ height: "40px", display: "inline-flex", alignItems: "center", textDecoration: "none", color: "#fff", fontWeight: "bold", padding: "0 20px" }}>
            Open AI Assistant
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default DoctorDashboard;