import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PatientCard from "../components/PatientCard";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    disease: "",
    status: "Stable",
    doctor: "",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.patients) {
          // Map backend _id to id if necessary, or just use it as is
          const mapped = response.data.patients.map(p => ({
            ...p,
            id: p._id || p.id,
          }));
          setPatients(mapped);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const statuses = useMemo(
    () => [...new Set(patients.map((patient) => patient.status || "Unknown"))],
    [patients]
  );

  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.trim().toLowerCase();
    const conditionStr = (patient.condition || patient.disease || "").toLowerCase();

    const matchesSearch =
      (patient.name || "").toLowerCase().includes(search) ||
      (patient.id || "").toLowerCase().includes(search) ||
      conditionStr.includes(search);
    const matchesStatus = !statusFilter || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = async () => {
    if (
      !newPatient.name ||
      !newPatient.age ||
      !newPatient.gender ||
      !newPatient.phone ||
      !newPatient.address ||
      !newPatient.disease
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const toastId = toast.loading("Saving patient...");
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/patients", {
        name: newPatient.name,
        age: Number(newPatient.age),
        gender: newPatient.gender,
        phone: newPatient.phone,
        address: newPatient.address,
        disease: newPatient.disease,
        status: newPatient.status,
        doctor: newPatient.doctor || "Not Assigned",
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.patient) {
        const p = res.data.patient;
        setPatients([...patients, { ...p, id: p._id }]);
        toast.success("Patient added successfully", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to save patient record", { id: toastId });
      // Fallback to local state if API fails
      setPatients([
        ...patients,
        {
          ...newPatient,
          id: `PT-${Date.now()}`,
        },
      ]);
    }

    setNewPatient({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
      disease: "",
      status: "Stable",
      doctor: "",
    });

    setShowForm(false);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);

    setNewPatient({
      name: patient.name,
      age: patient.age,
      gender: patient.gender || "",
      phone: patient.phone || "",
      address: patient.address || "",
      disease: patient.disease || patient.condition || "",
      status: patient.status || "Stable",
      doctor: patient.doctor || "",
    });

    setShowForm(true);
  };

  const handleUpdatePatient = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(`/patients/${editingPatient.id}`, {
        name: newPatient.name,
        age: Number(newPatient.age),
        gender: newPatient.gender,
        phone: newPatient.phone,
        address: newPatient.address,
        disease: newPatient.disease,
        status: newPatient.status,
        doctor: newPatient.doctor || "Not Assigned",
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.patient) {
        const updated = res.data.patient;
        setPatients(patients.map((patient) =>
          patient.id === editingPatient.id ? { ...updated, id: updated._id } : patient
        ));
        toast.success("Patient updated successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to update patient");
      // Fallback local update
      setPatients(patients.map((patient) =>
        patient.id === editingPatient.id ? { ...patient, ...newPatient } : patient
      ));
    }

    setEditingPatient(null);
    setShowForm(false);

    setNewPatient({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
      disease: "",
      status: "Stable",
      doctor: "",
    });
  };

  const handleDeletePatient = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Patient deleted successfully");
      setPatients(patients.filter((patient) => patient.id !== id));
    }
    catch (e) {
      console.error(e);
      toast.error(
        e.response?.data?.message ||
        "Failed to delete patient"
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPatient(null);
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
      disease: "",
      status: "Stable",
      doctor: "",
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
              name: "",
              age: "",
              gender: "",
              phone: "",
              address: "",
              disease: "",
              status: "Stable",
              doctor: "",
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
              Gender
              <select
                value={newPatient.gender}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    gender: e.target.value,
                  })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Phone
              <input
                type="text"
                value={newPatient.phone}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    phone: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Address
              <input
                type="text"
                value={newPatient.address}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    address: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Disease
              <input
                type="text"
                value={newPatient.disease}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    disease: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Doctor
              <input
                type="text"
                value={newPatient.doctor}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    doctor: e.target.value,
                  })
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

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
          Loading patients...
        </div>
      ) : (
        <>
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
            <p className="empty-state">No patients match the current filters or no patients found.</p>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default Patients;
