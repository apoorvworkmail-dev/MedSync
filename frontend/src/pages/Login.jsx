
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Login Successful");

      const user = response.data.user;

      const role = user.role?.toLowerCase();

      if (role === "admin") {
        navigate("/dashboard");
      }
      else if (role === "doctor") {
        navigate("/doctor");
      }
      else {
        navigate("/patient");
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Login Failed"
      );
    }
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
