import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../auth";
import { loginUser, registerUser } from "../services/api";
import "./RegisterPage.css";
import "./LoginPage.css";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    role: "client",
    email: "",
    password: "", confirm_password: "", phone: "", country_code: "+94"
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
        if (form.password !== form.confirm_password) throw new Error("Passwords do not match.");
        if (form.password.length < 8) throw new Error("Use at least 8 characters for your password.");
        await registerUser({
          name: form.name,
          role: form.role,
          email: form.email,
          password: form.password, phone: `${form.country_code} ${form.phone}`
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
<header className="register-site-header"><Link className="register-logo" to="/">Auto<span>Care</span></Link><Link to="/">← Back to website</Link></header>
        <section className="register-content" aria-labelledby="register-title">
          <div className="register-topbar"><Link to="/">← Back to home</Link><span>Already a member? <Link to="/login">Log in ↗</Link></span></div>
          <div className="register-form-wrap">
            <p className="register-eyebrow">SMART VEHICLE & SERVICE MANAGEMENT</p>
            <h2 id="register-title">Create Your AutoCare Account</h2>
            <p className="register-intro">Join a simpler way to manage vehicle maintenance and follow garage progress updates.</p>
            <nav className="register-steps" aria-label="Registration sections"><a href="#owner-information"><b>1</b><span><small>STEP 1</small>Owner & Account Profile</span></a><a href="#owner-information"><b>2</b><span><small>STEP 2</small>Vehicle Profile</span></a></nav><h3 id="owner-information">1. Owner Information</h3><form className="register-form" onSubmit={handleSubmit} aria-busy={loading}>
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
                <div className="register-password-wrap"><input id="register-password" type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} value={form.password} onChange={handleChange} disabled={loading} required /><button type="button" className="register-password-toggle" onClick={() => setShowPassword(previous => !previous)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</button></div>
              </div>
              <div className="register-field"><label htmlFor="register-confirm">Confirm password *</label><input id="register-confirm" name="confirm_password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirm_password} onChange={handleChange} placeholder="Re-enter your password" required disabled={loading} aria-describedby="register-match" /><small id="register-match" className={form.confirm_password && form.confirm_password !== form.password ? "register-mismatch" : "register-match"} aria-live="polite">{form.confirm_password ? form.confirm_password === form.password ? "Passwords match" : "Passwords do not match" : "Re-enter your password to confirm."}</small></div>
              <div className="register-strength register-full-width"><meter min="0" max="4" value={[form.password.length >= 8, /[A-Z]/.test(form.password) && /[a-z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length} aria-label="Password strength" /><small>Use a long password with a mix of letters, numbers, and symbols. {form.password.length} characters</small></div>
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
    <div className="login-page">
      <aside className="login-story">
        <Link className="login-brand" to="/">SMART VEHICLE <span>SERVICE & CARE</span></Link>
        <div>
          <p className="login-eyebrow">WELCOME BACK TO BETTER CARE</p>
          <h2>Your vehicle.<br />Your journey.<br /><span>You're in control.</span></h2>
          <p>Pick up where you left off. Your bookings, service updates, and next steps are waiting in your dashboard.</p>
          <ul><li>All your service bookings in one place</li><li>Updates that keep you in the loop</li><li>A dashboard built around your account</li></ul>
        </div>
        <p className="login-story-footer">BETTER CARE. EVERY JOURNEY.</p>
      </aside>
      <section className="login-content" aria-label="Log in to your account">
      <Link className="login-home" to="/">← Back to home</Link>
      <div className="auth-card">
        <p className="login-eyebrow">YOUR DASHBOARD AWAITS</p>
        <h1>{title}</h1>
        <p className="muted">Log in to keep your service journey moving.</p>

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

          <label htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" name="email" autoComplete="username" placeholder="you@example.com" value={form.email} onChange={handleChange} disabled={loading} required />

          <label htmlFor="login-password">Password</label>
          <div className="login-password-wrap">
            <input id="login-password" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={handleChange} disabled={loading} required />
            <button type="button" className="login-password-toggle" onClick={() => setShowPassword(previous => !previous)} aria-pressed={showPassword} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
          </div>

          {error && <p className="error-text" role="alert">{error}</p>}
          {message && <p className="success-text" role="status">{message}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in to your dashboard ↗"}
          </button>
        </form>

        <p className="switch-link">
          {isSignup ? "Already registered?" : "New user?"} {" "}
          <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Sign Up"}</Link>
        </p>
      </div>
      <footer className="login-footer">Smart Vehicle Service <span>Better care. Every journey.</span></footer>
      </section>
    </div>
  );
}


