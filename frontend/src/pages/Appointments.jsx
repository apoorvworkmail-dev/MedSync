import { useMemo, useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import appointmentsData from "../data/appointments";
import DashboardLayout from "../layouts/DashboardLayout";

function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statuses = useMemo(
    () => [...new Set(appointmentsData.map((appointment) => appointment.status))],
    [],
  );

  const filteredAppointments = appointmentsData.filter((appointment) => {
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

        <button type="button">New Appointment</button>
      </section>

      <section className="appointment-grid">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </section>

      {filteredAppointments.length === 0 && (
        <p className="empty-state">No appointments match the current filters.</p>
      )}
    </DashboardLayout>
  );
}

export default Appointments;
