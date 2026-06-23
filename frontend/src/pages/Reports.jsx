import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";

function Reports() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    patientName: "",
    reportName: "",
    reportType: "",
    department: "",
  });

  const fetchReports = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const response = await API.get("/reports/my-reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.reportName || !form.reportType || !file) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("patientName", form.patientName);
      formData.append("reportName", form.reportName);
      formData.append("reportType", form.reportType);
      formData.append("department", form.department || "General");
      formData.append("report", file);

      await API.post("/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Report uploaded successfully");
      setForm({
        patientName: "",
        reportName: "",
        reportType: "",
        department: "",
      });
      setFile(null);
      // Reset file input element
      const fileInput = document.getElementById("report-file");
      if (fileInput) fileInput.value = "";

      fetchReports();
    } catch (error) {
      console.error("Error uploading report:", error);
      toast.error(error.response?.data?.message || "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (reportId, filename) => {
    try {
      toast.loading("Downloading report...", { id: "downloading" });
      const response = await API.get(`/reports/download/${reportId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download complete", { id: "downloading" });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download report", { id: "downloading" });
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report? This will permanently remove it.")) {
      return;
    }

    try {
      toast.loading("Deleting report...", { id: "deleting" });
      await API.delete(`/reports/${reportId}`);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      toast.success("Report deleted successfully", { id: "deleting" });
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error(error.response?.data?.message || "Failed to delete report", { id: "deleting" });
    }
  };

  return (
    <DashboardLayout title="Reports" subtitle="Upload, view, and manage patient medical reports.">
      <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "start" }}>

        {/* Upload Form Panel */}
        <section className="dashboard-panel" style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a", marginBottom: "20px" }}>Upload Medical Report</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155" }} htmlFor="patientName">Patient Name</label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                placeholder="e.g., Apoorv Mishra"
                value={form.patientName}
                onChange={handleInputChange}
                style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155" }} htmlFor="reportName">Report Title</label>
              <input
                id="reportName"
                name="reportName"
                type="text"
                placeholder="e.g., Blood Test June"
                value={form.reportName}
                onChange={handleInputChange}
                style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155" }} htmlFor="reportType">Report Type</label>
              <input
                id="reportType"
                name="reportType"
                type="text"
                placeholder="e.g., CBC, MRI, Ultrasound"
                value={form.reportType}
                onChange={handleInputChange}
                style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155" }} htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="e.g., Cardiology, Pathology"
                value={form.department}
                onChange={handleInputChange}
                style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#334155" }} htmlFor="report-file">Select Document (PDF/Image)</label>
              <input
                id="report-file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                style={{ padding: "8px 0", fontSize: "0.9rem" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              style={{
                marginTop: "12px",
                padding: "12px 20px",
                background: "#2563eb",
                color: "#ffffff",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                fontSize: "0.95rem",
                cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.7 : 1,
                transition: "background 0.2s"
              }}
            >
              {uploading ? "Analyzing Report..." : "Upload Report"}
            </button>

          </form>
        </section>

        {/* Reports Feed/List */}
        <section className="dashboard-panel" style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", minHeight: "450px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a", marginBottom: "20px" }}>My Generated Reports</h2>

          {loading ? (
            <div style={{ padding: "4rem 0", textAlign: "center", color: "#64748b", fontSize: "1rem" }}>Loading medical reports...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: "4rem 0", textAlign: "center", color: "#64748b", fontSize: "1.05rem" }}>
              No reports uploaded yet. Fill out the upload form to add patient documents.
            </div>
          ) : (
            <div>
              {reports.map((report) => (
                <div
                  key={report._id}
                  style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "15px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3>{report.reportName}</h3>

                  <p>
                    <strong>Type:</strong> {report.reportType}
                  </p>

                  <p>
                    <strong>Department:</strong> {report.department}
                  </p>

                  <p>
                    <strong>Status:</strong> {report.status}
                  </p>

                  <p>
                    <strong>Uploaded:</strong>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  {report.aiSummary && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "15px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        borderLeft: "4px solid #2563eb",
                      }}
                    >
                      <h4>
                        AI Summary
                      </h4>

                      <p>
                        {report.aiSummary}
                      </p>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                    {report.fileUrl ? (
                      <a
                        href={`http://localhost:5000/${report.fileUrl.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "8px 16px",
                          background: "#3b82f6",
                          color: "#fff",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          display: "inline-block"
                        }}
                      >
                        View
                      </a>
                    ) : (
                      <span style={{ color: "#94a3b8", fontStyle: "italic", alignSelf: "center" }}>No Document File</span>
                    )}

                    {report.fileUrl && (
                      <button
                        onClick={() => handleDownload(report._id, `${report.reportName || "report"}-${report.patientName || "patient"}.pdf`)}
                        style={{
                          padding: "8px 16px",
                          background: "#64748b",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          cursor: "pointer"
                        }}
                      >
                        Download
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(report._id)}
                      style={{
                        padding: "8px 16px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
}

export default Reports;
