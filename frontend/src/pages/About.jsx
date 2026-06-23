import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function About() {
  const token = localStorage.getItem("token");

  const features = [
    "Patient Management",
    "Doctor Directory",
    "Appointment Scheduling",
    "Medical Reports",
    "AI Health Assistant",
    "AI Report Summaries",
  ];

  const pageContent = (
    <>
      <div className="dashboard-panel">
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "15px" }}>Our Mission</h2>
        <p style={{ color: "#475569", lineHeight: "1.7" }}>
          MedSync is a modern healthcare management platform
          designed to simplify hospital operations, improve
          patient care, and empower healthcare professionals
          through AI-powered tools and centralized data management.
        </p>
      </div>

      <div className="dashboard-panel" style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "15px" }}>What MedSync Offers</h2>
        <div className="resource-grid">
          {features.map((feature) => (
            <div
              key={feature}
              className="resource-card"
            >
              <h3>{feature}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-panel" style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "15px" }}>Why Choose MedSync?</h2>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", color: "#475569" }}>
          <li>Secure Authentication System</li>
          <li>AI-Powered Healthcare Assistance</li>
          <li>Appointment Scheduling</li>
          <li>Medical Report Management</li>
          <li>Doctor & Patient Dashboards</li>
          <li>Modern and Responsive UI</li>
        </ul>
      </div>

      <div className="dashboard-panel" style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "15px" }}>Project Statistics</h2>
        <div className="resource-grid">
          <div className="resource-card">
            <h3>10,000+</h3>
            <p>Active Users</p>
          </div>

          <div className="resource-card">
            <h3>50,000+</h3>
            <p>Appointments</p>
          </div>

          <div className="resource-card">
            <h3>25,000+</h3>
            <p>Patients</p>
          </div>

          <div className="resource-card">
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>
        </div>
      </div>
    </>
  );

  if (token) {
    return (
      <DashboardLayout
        title="About MedSync"
        subtitle="Transforming Healthcare Through Technology"
      >
        {pageContent}
      </DashboardLayout>
    );
  }

  return (
    <div className="landing-page" style={{ paddingTop: "80px", minHeight: "100vh", background: "#f8fafc" }}>
      <header className="landing-header">
        <Link to="/" className="brand">
          <span className="brand-mark">M</span>
          <span>MedSync</span>
        </Link>

        <nav className="landing-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About Us</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </header>

      <section style={{
        padding: "60px 9% 40px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px" }}>About MedSync</h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.1rem" }}>Transforming Healthcare Through Technology</p>
        </div>
      </section>

      <main style={{ padding: "40px 9%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        {pageContent}
      </main>
    </div>
  );
}

export default About;
