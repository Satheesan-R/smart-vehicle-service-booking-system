import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../auth";
import { loginUser, registerUser } from "../services/api";
import "./RegisterPage.css";

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
  const [showPassword, setShowPassword] = useState(false);
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

  if (isSignup) {
    return (
      <main className="register-page">
        <aside className="register-story" aria-labelledby="register-story-title">
          <Link className="register-brand" to="/" aria-label="Smart Vehicle Service home"><span className="register-brand-mark" aria-hidden="true">S.</span><span>SMART VEHICLE<small>SERVICE & CARE</small></span></Link>
          <div className="register-story-content">
            <p className="register-eyebrow">YOUR NEXT JOURNEY STARTS HERE</p>
            <h1 id="register-story-title">Better care. <br />Fewer worries. <br /><span>All in one place.</span></h1>
            <p>Join a simpler way to book, manage, and follow your vehicle's service journey.</p>
            <ul className="register-benefits">
              <li><span aria-hidden="true">01</span><div><strong>Book on your schedule</strong><p>Send a service request with your preferred date.</p></div></li>
              <li><span aria-hidden="true">02</span><div><strong>Stay in the loop</strong><p>Follow progress and updates from your garage.</p></div></li>
              <li><span aria-hidden="true">03</span><div><strong>Keep everything together</strong><p>Manage your bookings from one dashboard.</p></div></li>
            </ul>
          </div>
          <div className="register-story-footer"><span>BUILT FOR DRIVERS & GARAGES</span><span aria-hidden="true">↗</span></div>
        </aside>
        <section className="register-content" aria-labelledby="register-title">
          <div className="register-topbar"><Link to="/">← Back to home</Link><span>Already a member? <Link to="/login">Log in ↗</Link></span></div>
          <div className="register-form-wrap">
            <p className="register-eyebrow">LET'S GET YOU STARTED</p>
            <h2 id="register-title">Create your account<span>.</span></h2>
            <p className="register-intro">A smoother service experience is just a few details away.</p>
            <form className="register-form" onSubmit={handleSubmit} aria-busy={loading}>
              <fieldset className="register-role-picker" disabled={loading}>
                <legend>I'm joining as a</legend>
                <div className="register-role-options">
                  <label className={form.role === "client" ? "register-role selected" : "register-role"}><input type="radio" name="role" value="client" checked={form.role === "client"} onChange={handleChange} /><span><strong>Vehicle owner</strong><small>Book & track services</small></span></label>
                  <label className={form.role === "garage" ? "register-role selected" : "register-role"}><input type="radio" name="role" value="garage" checked={form.role === "garage"} onChange={handleChange} /><span><strong>Garage team</strong><small>Manage service requests</small></span></label>
                </div>
              </fieldset>
              <div className="register-field"><label htmlFor="register-name">{form.role === "garage" ? "Garage name" : "Full name"}</label><input id="register-name" name="name" autoComplete={form.role === "garage" ? "organization" : "name"} placeholder={form.role === "garage" ? "Enter your garage name" : "Enter your full name"} value={form.name} onChange={handleChange} disabled={loading} required /></div>
              <div className="register-field"><label htmlFor="register-email">Email address</label><input id="register-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} disabled={loading} required /></div>
              <div className="register-field">
                <label htmlFor="register-password">Password</label>
                <div className="register-password-wrap"><input id="register-password" type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={handleChange} disabled={loading} required /><button type="button" className="register-password-toggle" onClick={() => setShowPassword(previous => !previous)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</button></div>
              </div>
              {error && <p className="register-error" role="alert">{error}</p>}
              {message && <p className="register-success" role="status">{message}</p>}
              <button className="register-submit" type="submit" disabled={loading}><span>{loading ? "Creating your account..." : "Create account"}</span><span aria-hidden="true">↗</span></button>
              <p className="register-form-note">{form.role === "garage" ? "Your next step: log in and manage customer service requests." : "Your next step: log in and book your first vehicle service."}</p>
            </form>
          </div>
          <footer className="register-footer">Smart Vehicle Service <span>Better care. Every journey.</span></footer>
        </section>
      </main>
    );
  }
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
