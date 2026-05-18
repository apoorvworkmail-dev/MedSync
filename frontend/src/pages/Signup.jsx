import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSignup = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-header">
          <Link to="/" className="auth-brand">MedSync</Link>
          <h1>Create account</h1>
          <p>Start managing healthcare workflows with a cleaner digital workspace.</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            autoComplete="name"
            onChange={handleChange}
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="doctor@medsync.com"
            value={form.email}
            autoComplete="email"
            onChange={handleChange}
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Create password"
            value={form.password}
            autoComplete="new-password"
            onChange={handleChange}
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
