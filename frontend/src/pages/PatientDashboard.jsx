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

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const appointmentsRes = await API.get("/appointments/my", { headers });

        if (appointmentsRes.data.appointments) {
          setAppointments(appointmentsRes.data.appointments.map(normalizeAppointment));
        }
      } catch (error) {
        console.error("PatientDashboard loading error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/ai/personalized-insights", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.insights) {
        setAiInsights(res.data.insights);
      } else {
        setAiInsights("AI Coach: Keep up with your scheduled visits. Consult your doctor for specific queries.");
      }
    } catch (error) {
      console.error(error);
      setAiInsights("Unable to retrieve insights at this time. Please make sure your server configuration is correct.");
    } finally {
      setLoadingInsights(false);
    }
  };

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
      title="My Health Hub" 
      subtitle="Track your scheduled appointments, view clinical logs, and consult the AI coach."
    >
      <div className="card-container reports-summary">
        <DashboardCard 
          title="My Appointments" 
          value={appointments.filter(a => a.status !== "Cancelled").length.toString()} 
          detail="Upcoming scheduled visits" 
          tone="blue" 
        />
        <DashboardCard 
          title="Clinical Reports" 
          value="2" 
          detail="Available in database" 
          tone="green" 
        />
        <DashboardCard 
          title="AI Assistant Status" 
          value="Online" 
          detail="24/7 Virtual health coach" 
          tone="purple" 
        />
        <DashboardCard 
          title="Unread Messages" 
          value="0" 
          detail="From care provider" 
          tone="orange" 
        />
      </div>

      <div className="dashboard-grid">
        {/* Appointments List */}
        <section className="dashboard-panel">
          <header className="panel-heading">
            <h2>Your Appointments</h2>
            <Link to="/appointments" className="view-all-link" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
              Book & Manage
            </Link>
          </header>

          {loading ? (
            <p className="empty-state">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="empty-state">You have no upcoming appointments.</p>
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

        {/* AI Health Coaching */}
        <section className="dashboard-panel">
          <header className="panel-heading">
            <h2>AI Personal Health Insights</h2>
          </header>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "150px", justifyContent: "space-between" }}>
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
              {aiInsights || "Click the button below to analyze your appointment history and clinical profile to receive wellness suggestions from the AI Coach."}
            </p>

            <button 
              onClick={handleFetchInsights} 
              disabled={loadingInsights}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              {loadingInsights ? "Analyzing Profile..." : "Generate AI Wellness Report"}
            </button>
          </div>
        </section>
      </div>

      {/* Quick Action Banner */}
      <section className="dashboard-panel" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Have a Health Query or Symptom Check?</h3>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
              Start an interactive session with our AI Assistant to understand medical terms, get self-care advice, or find specialists.
            </p>
          </div>
          <Link to="/ai-assistant" className="btn btn-primary" style={{ height: "40px", display: "inline-flex", alignItems: "center", textDecoration: "none", color: "#fff", fontWeight: "bold", padding: "0 20px" }}>
            Chat with AI
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default PatientDashboard;