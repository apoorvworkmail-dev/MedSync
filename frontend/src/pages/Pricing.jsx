import { useState } from "react";
import { Link } from "react-router-dom";

function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "annual"

  const plans = [
    {
      name: "Patient Plan",
      price: "0",
      description:
        "Everything a patient needs to manage healthcare in one place.",
      features: [
        "Book Appointments",
        "AI Health Assistant",
        "Upload Medical Reports",
        "Download Reports",
        "Access Doctor Directory",
        "Secure Patient Account"
      ],
      cta: "Get Started Free",
      popular: false,
      buttonStyle: "btn btn-primary"
    },
    {
      name: "Doctor Pro",
      price: billingCycle === "monthly" ? "499" : "399",
      description:
        "Advanced tools for doctors and private practices.",
      features: [
        "Unlimited Appointments",
        "Patient Management",
        "AI Report Summaries",
        "Medical Records Access",
        "Analytics Dashboard",
        "Priority Support"
      ],
      cta: "Upgrade to Pro",
      popular: true,
      buttonStyle: "btn btn-primary"
    },
    {
      name: "Hospital Enterprise",
      price: "Custom",
      description:
        "Complete healthcare management solution for hospitals.",
      features: [
        "Multi-Doctor Management",
        "Unlimited Patients",
        "Advanced Analytics",
        "Centralized Records",
        "Dedicated Support",
        "API Integration"
      ],
      cta: "Contact Sales",
      popular: false,
      buttonStyle: "btn btn-primary"
    }
  ];

  return (
    <div className="landing-page" style={{ paddingTop: "80px", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="brand">
          <span className="brand-mark">M</span>
          <span>MedSync</span>
        </Link>

        <nav className="landing-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/pricing" className="active">Pricing</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </header>

      {/* Hero section */}
      <section style={{
        padding: "80px 9% 40px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "rgba(37, 99, 235, 0.16)",
            color: "#60a5fa",
            borderRadius: "99px",
            fontSize: "0.875rem",
            fontWeight: "700",
            marginBottom: "24px"
          }}>Simple, Transparent Pricing</span>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", lineHeight: "1.15", marginBottom: "20px" }}>
            Plans Built for Clinics of <span style={{ color: "#3b82f6" }}>All Sizes</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "40px" }}>
            No hidden setup fees, contract lock-ins, or complicated upgrade tiers. Choose the plan that aligns with your practice.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.08)",
            padding: "4px",
            borderRadius: "99px",
            border: "1px solid rgba(255, 255, 255, 0.12)"
          }}>
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "10px 24px",
                borderRadius: "99px",
                border: "none",
                background: billingCycle === "monthly" ? "#2563eb" : "transparent",
                color: "white",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              style={{
                padding: "10px 24px",
                borderRadius: "99px",
                border: "none",
                background: billingCycle === "annual" ? "#2563eb" : "transparent",
                color: "white",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              Annual Billing <span style={{ fontSize: "0.8rem", color: "#10b981", marginLeft: "4px" }}>(-20%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section style={{ padding: "80px 9% 60px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px", alignItems: "stretch" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "40px 30px",
              border: plan.popular ? "2px solid #2563eb" : "1px solid #e2e8f0",
              boxShadow: plan.popular ? "0 20px 40px rgba(37, 99, 235, 0.12)" : "0 10px 30px rgba(0,0,0,0.03)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {plan.popular && (
              <span style={{
                position: "absolute",
                top: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#2563eb",
                color: "white",
                fontWeight: "800",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: "99px",
                letterSpacing: "0.5px"
              }}>
                Recommended Plan
              </span>
            )}

            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>{plan.name}</h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "30px", minHeight: "60px" }}>
                {plan.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  marginBottom: "30px"
                }}
              >
                {plan.price === "Custom" ? (
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: "900",
                      color: "#0f172a"
                    }}
                  >
                    Custom Pricing
                  </span>
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "900",
                        color: "#0f172a"
                      }}
                    >
                      ₹{plan.price}
                    </span>

                    <span
                      style={{
                        color: "#64748b",
                        fontWeight: "600",
                        marginLeft: "6px"
                      }}
                    >
                      / month
                    </span>
                  </>
                )}
              </div>

              <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", marginBottom: "30px" }} />

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#475569", fontSize: "0.95rem" }}>
                    <span style={{ color: "#10b981", fontWeight: "900" }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={plan.cta.includes("Sales") ? "/contact" : "/signup"}
              className={plan.buttonStyle}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "1rem",
                textDecoration: "none",
                display: "block"
              }}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section
        style={{
          padding: "60px 9%",
          background: "white"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "2rem",
            fontWeight: "800"
          }}
        >
          Trusted By Healthcare Professionals
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px",
            textAlign: "center"
          }}
        >
          <div>
            <h3 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#2563eb", marginBottom: "8px" }}>10,000+</h3>
            <p style={{ color: "#64748b", fontWeight: "600" }}>Active Users</p>
          </div>

          <div>
            <h3 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#2563eb", marginBottom: "8px" }}>50,000+</h3>
            <p style={{ color: "#64748b", fontWeight: "600" }}>Appointments</p>
          </div>

          <div>
            <h3 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#2563eb", marginBottom: "8px" }}>25,000+</h3>
            <p style={{ color: "#64748b", fontWeight: "600" }}>Patients</p>
          </div>

          <div>
            <h3 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#2563eb", marginBottom: "8px" }}>500+</h3>
            <p style={{ color: "#64748b", fontWeight: "600" }}>Hospitals</p>
          </div>

          <div>
            <h3 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#2563eb", marginBottom: "8px" }}>99.9%</h3>
            <p style={{ color: "#64748b", fontWeight: "600" }}>Uptime</p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ padding: "60px 9% 100px", background: "#f1f5f9" }}>
        <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "#0f172a", marginBottom: "50px", textAlign: "center" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", maxWidth: "1100px", margin: "0 auto" }}>
          <div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Can I change plans later?</h4>
            <p style={{ color: "#64748b", lineHeight: "1.6" }}>
              Absolutely. You can upgrade, downgrade, or cancel your subscription at any time. Downgrades or cancellations will take effect at the end of your current billing cycle.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>How does the AI Summary tool work?</h4>
            <p style={{ color: "#64748b", lineHeight: "1.6" }}>
              MedSync uses Google's state-of-the-art Gemini generative model to analyze raw text extracted from uploaded patient reports and return a clear, easy-to-read explanation.
            </p>
          </div>
          <div>
            <h4
              style={{
                fontSize: "1.15rem",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "12px"
              }}
            >
              How secure is my medical data?
            </h4>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6"
              }}
            >
              MedSync uses encrypted connections, secure authentication, and protected database storage to safeguard patient information.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Do you offer custom pricing for hospitals?</h4>
            <p style={{ color: "#64748b", lineHeight: "1.6" }}>
              Yes. If you manage a large hospital network or need specialized features (like FHIR integrations), please contact us, and we will configure a custom enterprise plan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
