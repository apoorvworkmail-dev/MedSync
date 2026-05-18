import { Link } from "react-router-dom";
import heroImage from "../assets/medsync-hero.png";

function Home() {
  const stats = [
    { label: "Active Users", value: "10,000+", tone: "blue" },
    { label: "Appointments", value: "50,000+", tone: "green" },
    { label: "Patients", value: "25,000+", tone: "purple" },
    { label: "Hospitals", value: "500+", tone: "orange" },
    { label: "Uptime", value: "99.9%", tone: "cyan" },
  ];

  const features = [
    {
      title: "Patient Management",
      text: "Complete patient records and history management",
      tone: "blue",
    },
    {
      title: "Appointment Scheduling",
      text: "Smart scheduling with automated reminders",
      tone: "green",
    },
    {
      title: "Medical Records",
      text: "Secure digital records and document management",
      tone: "purple",
    },
    {
      title: "Analytics & Reports",
      text: "Advanced analytics and comprehensive reporting",
      tone: "orange",
    },
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link to="/" className="brand">
          <span className="brand-mark">M</span>
          <span>MedSync</span>
        </Link>

        <nav className="landing-nav" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About Us</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="landing-hero"
          style={{ "--hero-image": `url(${heroImage})` }}
        >
          <div className="hero-content">
            <span className="hero-pill">Next Generation Healthcare</span>

            <h1>
              Healthcare
              <span>Made Smarter,</span>
              Care Made Better
            </h1>

            <p>
              MedSync is a comprehensive healthcare management system that
              streamlines operations and improves patient care.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-large">
                Get Started Now
                <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link to="/dashboard" className="btn btn-glass btn-large">
                <span className="play-dot" aria-hidden="true" />
                Watch Demo
              </Link>
            </div>

            <div className="trusted-row">
              <div className="avatar-stack" aria-hidden="true">
                <span>DR</span>
                <span>NP</span>
                <span>MD</span>
              </div>
              <p>
                <strong>Trusted by 5000+</strong>
                Healthcare Professionals
              </p>
            </div>
          </div>

          <div className="hero-panel" aria-hidden="true">
            <div className="panel-top">Patient Overview Healthcare</div>
            <div className="patient-row">
              <span className="patient-avatar" />
              <div>
                <strong>John Doe</strong>
                <small>ID: PT-2034-001</small>
              </div>
            </div>
            <div className="vital-grid">
              <div><span>Heart Rate</span><strong>72 bpm</strong></div>
              <div><span>Blood Pressure</span><strong>120/80</strong></div>
              <div><span>Oxygen Level</span><strong>98%</strong></div>
              <div><span>Temperature</span><strong>98.6F</strong></div>
            </div>
          </div>

          <div className="hero-stats">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <span className={`stat-icon ${stat.tone}`}>{stat.value.slice(0, 2)}</span>
                <div>
                  <strong>{stat.value}</strong>
                  <p>{stat.label}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="features-copy">
            <span className="section-label">Powerful Features</span>
            <h2>Everything you need to manage healthcare efficiently</h2>
            <p>
              MedSync provides a complete suite of tools designed to streamline
              healthcare operations and improve patient outcomes.
            </p>

            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <span className={`feature-icon ${feature.tone}`}>{feature.title.charAt(0)}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="dashboard-preview" aria-label="Dashboard preview">
            <aside>
              <div className="preview-logo">MedSync</div>
              <span className="preview-active">Dashboard</span>
              <span>Patients</span>
              <span>Appointments</span>
              <span>Doctors</span>
              <span>Services</span>
              <span>Reports</span>
              <span>Settings</span>
            </aside>

            <div className="preview-main">
              <div className="preview-toolbar">
                <span>Welcome back, Dr. Sarah Johnson</span>
                <div className="preview-search">Search...</div>
              </div>

              <div className="preview-metrics">
                <article><small>Total Patients</small><strong>2,543</strong><em>+12%</em></article>
                <article><small>Today's Appointments</small><strong>28</strong><em>+8%</em></article>
                <article><small>Total Revenue</small><strong>$45,231</strong><em>+15%</em></article>
                <article><small>Pending Tasks</small><strong>14</strong><em>+5</em></article>
              </div>

              <div className="preview-lower">
                <div className="appointments-list">
                  <h3>Recent Appointments</h3>
                  <p><span>John Doe</span><strong>09:00 AM</strong><em>Confirmed</em></p>
                  <p><span>Jane Smith</span><strong>10:30 AM</strong><em>Confirmed</em></p>
                  <p><span>Mike Johnson</span><strong>02:00 PM</strong><em>Pending</em></p>
                </div>
                <div className="chart-card">
                  <h3>Patient Overview</h3>
                  <div className="chart-line" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
