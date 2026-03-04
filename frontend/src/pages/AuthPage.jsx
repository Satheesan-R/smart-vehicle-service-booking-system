import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../auth";
import { loginUser, registerUser } from "../services/api";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    role: "client",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(() => (isSignup ? "Create Account" : "Welcome Back"), [isSignup]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isSignup) {
        await registerUser({
          name: form.name,
          role: form.role,
          email: form.email,
          password: form.password
        });
        setMessage("Registration successful. Please login now.");
        navigate("/login");
      } else {
        const authData = await loginUser({ email: form.email, password: form.password });
        saveAuth(authData);
        navigate(authData.user.role === "garage" ? "/garage" : "/client");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>{title}</h1>
        <p className="muted">{isSignup ? "Register as Client or Garage" : "Login with your email and password"}</p>

        <form className="form" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />

              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="client">Client</option>
                <option value="garage">Garage</option>
              </select>
            </>
          )}

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Register" : "Login"}
          </button>
        </form>

        <p className="switch-link">
          {isSignup ? "Already registered?" : "New user?"} {" "}
          <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Sign Up"}</Link>
        </p>
      </div>
    </div>
  );
}