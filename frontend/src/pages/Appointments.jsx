import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppointmentCard from "../components/AppointmentCard";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

const fallbackText = (value, fallback) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const formatAppointmentDate = (value) => {
  if (!value) {
    return "Date not set";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "Date not set" : date.toLocaleDateString();
};

const normalizeAppointment = (appointment) => ({
  id: appointment._id || appointment.id,
  patient: fallbackText(
    appointment.patientName || appointment.patient?.name,
    "Unknown patient",
  ),
  doctor: fallbackText(
    appointment.doctor?.name || appointment.doctor,
    "Unassigned doctor",
  ),
  date: formatAppointmentDate(appointment.appointmentDate),
  type: fallbackText(appointment.reason, "General visit"),
  time: fallbackText(appointment.appointmentTime || appointment.time, "Time not set"),
  status: fallbackText(appointment.status, "Pending"),
});

function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const fetchAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Appointments API Response:", response.data);

      setAppointments(
        (response.data.appointments || []).map(normalizeAppointment)
      );
    } catch (error) {
      console.log("Appointments Error:", error);
      setErrorMessage("Unable to load appointments right now.");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBookAppointment = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post("/appointments", newAppointment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Appointment booked successfully");

      setShowForm(false);

      setNewAppointment({
        doctor: "",
        appointmentDate: "",
        appointmentTime: "",
      });

      fetchAppointments();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to book appointment");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Appointment cancelled successfully");

      fetchAppointments();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to cancel appointment"
      );
    }
  };

  useEffect(() => {
    let isActive = true;
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    Promise.all([
      API.get("/appointments/my", { headers }),
      API.get("/doctors", { headers }),
    ])
      .then(([appointmentsResponse, doctorsResponse]) => {
        if (!isActive) {
          return;
        }

        setAppointments(
          (appointmentsResponse.data.appointments || []).map(normalizeAppointment),
        );
        setDoctors(doctorsResponse.data.doctors || []);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        console.log("Appointments Page Error:", error);
        setErrorMessage("Unable to load appointments right now.");
        setAppointments([]);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const statuses = useMemo(
    () => [...new Set(appointments.map((appointment) => appointment.status).filter(Boolean))],
    [appointments],
  );

  const filteredAppointments = appointments.filter((appointment) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      appointment.patient.toLowerCase().includes(search) ||
      appointment.doctor.toLowerCase().includes(search) ||
      appointment.type.toLowerCase().includes(search);
    const matchesStatus = !statusFilter || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="Appointments" subtitle="Manage today's schedule and upcoming visits.">
      <section className="page-toolbar">
        <label className="filter-control">
          <span>Search appointments</span>
          <input
            type="search"
            placeholder="Patient, doctor, or type"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label className="filter-control">
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
        >
          New Appointment
        </button>
      </section>

      {showForm && (
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "16px",
            marginBottom: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Book Appointment
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr auto",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <select
              value={newAppointment.doctor}
              onChange={(event) =>
                setNewAppointment({
                  ...newAppointment,
                  doctor: event.target.value,
                })
              }
              style={{
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "14px",
                width: "100%",
                backgroundColor: "#fff",
              }}
            >
              <option value="">Select Doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={newAppointment.appointmentDate}
              onChange={(event) =>
                setNewAppointment({
                  ...newAppointment,
                  appointmentDate: event.target.value,
                })
              }
              style={{
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            />

            <input
              type="time"
              value={newAppointment.appointmentTime}
              onChange={(event) =>
                setNewAppointment({
                  ...newAppointment,
                  appointmentTime: event.target.value,
                })
              }
              style={{
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            />

            <button
              type="button"
              onClick={handleBookAppointment}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}

      {errorMessage && <p className="empty-state">{errorMessage}</p>}

      {isLoading ? (
        <p className="empty-state">Loading appointments...</p>
      ) : (
        <section className="appointment-grid">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={handleCancelAppointment}
            />
          ))}
        </section>
      )}

      {!isLoading && !errorMessage && filteredAppointments.length === 0 && (
        <p className="empty-state">No appointments match the current filters.</p>
      )}
    </DashboardLayout>
  );
}

export default Appointments;
