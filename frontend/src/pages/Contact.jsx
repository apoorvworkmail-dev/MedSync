import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";

function Contact() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }

    const toastId = toast.loading("Sending message...");
    try {
      await API.post("/contact", form);

      toast.success("Message sent successfully!", { id: toastId });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.", { id: toastId });
    }
  };

  const pageContent = (
    <>
      <div className="dashboard-panel">
        <h2 style={{ marginBottom: "20px", fontSize: "1.5rem", fontWeight: "700" }}>
          Contact MedSync
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "700px",
          }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="contact-input"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="contact-input"
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({
                ...form,
                subject: e.target.value,
              })
            }
            className="contact-input"
            required
          />

          <textarea
            rows="6"
            placeholder="Write your message here..."
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            className="contact-textarea"
            required
          />

          <button
            type="submit"
            className="contact-btn"
          >
            Send Message
          </button>
        </form>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div className="dashboard-panel">
          <h3>📧 Email Support</h3>
          <p style={{ marginTop: "8px", color: "#475569" }}>support@medsync.com</p>
        </div>

        <div className="dashboard-panel">
          <h3>📞 Phone Support</h3>
          <p style={{ marginTop: "8px", color: "#475569" }}>+91 98765 43210</p>
        </div>

        <div className="dashboard-panel">
          <h3>🏥 Address</h3>
          <p style={{ marginTop: "8px", color: "#475569" }}>Dehradun, Uttarakhand, India</p>
        </div>
      </div>
    </>
  );

  if (token) {
    return (
      <DashboardLayout
        title="Contact Us"
        subtitle="Get in touch with MedSync"
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
          <Link to="/about">About Us</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/contact" className="active">Contact</Link>
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px" }}>Contact Us</h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.1rem" }}>Get in touch with MedSync</p>
        </div>
      </section>

      <main style={{ padding: "40px 9%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        {pageContent}
      </main>
    </div>
  );
}

export default Contact;
