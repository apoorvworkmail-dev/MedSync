import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-header">
          <Link to="/" className="auth-brand">MedSync</Link>
          <h1>Welcome back</h1>
          <p>Sign in to continue managing your healthcare workspace.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            placeholder="doctor@medsync.com"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-switch">
          New to MedSync? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
