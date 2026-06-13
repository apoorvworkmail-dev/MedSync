import { useMemo, useState } from "react";
import PatientCard from "../components/PatientCard";
import patientsData from "../data/patients";
import DashboardLayout from "../layouts/DashboardLayout";

function Patients() {
  const [patients, setPatients] = useState(patientsData);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [newPatient, setNewPatient] = useState({
    id: "",
    name: "",
    age: "",
    condition: "",
    status: "Stable",
  });

  const statuses = useMemo(
    () => [...new Set(patients.map((patient) => patient.status))],
    [patients]
  );

  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.trim().toLowerCase();
    const conditionStr = (patient.condition || patient.disease || "").toLowerCase();
    
    const matchesSearch =
      patient.name.toLowerCase().includes(search) ||
      patient.id.toLowerCase().includes(search) ||
      conditionStr.includes(search);
    const matchesStatus = !statusFilter || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.condition) {
      alert("Please fill all fields");
      return;
    }

    setPatients([
      ...patients,
      {
        ...newPatient,
        disease: newPatient.condition,
        doctor: "Not Assigned",
        id: `PT-${Date.now()}`,
      },
    ]);

    setNewPatient({
      id: "",
      name: "",
      age: "",
      condition: "",
      status: "Stable",
    });

    setShowForm(false);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);

    setNewPatient({
      name: patient.name,
      age: patient.age,
      condition: patient.condition || patient.disease,
      status: patient.status,
    });

    setShowForm(true);
  };

  const handleUpdatePatient = () => {
    const updatedPatients = patients.map((patient) =>
      patient.id === editingPatient.id
        ? {
            ...patient,
            ...newPatient,
            disease: newPatient.condition,
          }
        : patient
    );

    setPatients(updatedPatients);
    setEditingPatient(null);
    setShowForm(false);

    setNewPatient({
      id: "",
      name: "",
      age: "",
      condition: "",
      status: "Stable",
    });
  };

  const handleDeletePatient = (id) => {
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPatient(null);
    setNewPatient({
      id: "",
      name: "",
      age: "",
      condition: "",
      status: "Stable",
    });
  };

  return (
    <DashboardLayout
      title="Patients"
      subtitle="Track patient profiles, records, and care status."
    >
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

        <button
          type="button"
          onClick={() => {
            setEditingPatient(null);
            setNewPatient({
              id: "",
              name: "",
              age: "",
              condition: "",
              status: "Stable",
            });
            setShowForm(true);
          }}
        >
          Add Patient
        </button>
      </section>

      {showForm && (
        <section className="dashboard-panel" style={{ marginBottom: "22px" }}>
          <header className="panel-heading">
            <h2>{editingPatient ? "Edit Patient" : "Add New Patient"}</h2>
            <button onClick={handleCancel} className="close-btn">
              ✕
            </button>
          </header>

          <div className="settings-form settings-form-grid">
            <label>
              Patient Name
              <input
                type="text"
                placeholder="Name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
              />
            </label>

            <label>
              Age
              <input
                type="number"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, age: e.target.value })
                }
              />
            </label>

            <label>
              Condition
              <input
                type="text"
                placeholder="Condition"
                value={newPatient.condition}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, condition: e.target.value })
                }
              />
            </label>

            <label>
              Status
              <select
                value={newPatient.status}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, status: e.target.value })
                }
                className="status-select"
              >
                <option value="Stable">Stable</option>
                <option value="Critical">Critical</option>
                <option value="Recovering">Recovering</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button onClick={editingPatient ? handleUpdatePatient : handleAddPatient}>
              {editingPatient ? "Update Patient" : "Save Patient"}
            </button>
          </div>
        </section>
      )}

      <section className="resource-grid">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
          />
        ))}
      </section>

      {filteredPatients.length === 0 && (
        <p className="empty-state">No patients match the current filters.</p>
      )}
    </DashboardLayout>
  );
}

export default Patients;
