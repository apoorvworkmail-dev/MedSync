import { useMemo, useState } from "react";
import PatientCard from "../components/PatientCard";
import patientsData from "../data/patients";
import DashboardLayout from "../layouts/DashboardLayout";

function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statuses = useMemo(
    () => [...new Set(patientsData.map((patient) => patient.status))],
    [],
  );

  const filteredPatients = patientsData.filter((patient) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(search) ||
      patient.id.toLowerCase().includes(search) ||
      patient.condition.toLowerCase().includes(search);
    const matchesStatus = !statusFilter || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="Patients" subtitle="Track patient profiles, records, and care status.">
      <section className="page-toolbar">
        <label className="filter-control">
          <span>Search patients</span>
          <input
            type="search"
            placeholder="Name, ID, or condition"
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

        <button type="button">Add Patient</button>
      </section>

      <section className="resource-grid">
        {filteredPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </section>

      {filteredPatients.length === 0 && (
        <p className="empty-state">No patients match the current filters.</p>
      )}
    </DashboardLayout>
  );
}

export default Patients;
