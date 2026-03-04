import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h2 className="brand">Smart Vehicle Service</h2>
        <div className="auth-actions">
          <Link className="btn btn-outline" to="/signup">
            Sign Up
          </Link>
          <Link className="btn btn-primary" to="/login">
            Login
          </Link>
        </div>
      </header>

      <section className="hero">
        <h1>Professional Vehicle Service Booking Platform</h1>
        <p>
          Book vehicle servicing online, track status in real time, and connect with trusted garages in one
          transparent workflow. From routine maintenance to urgent repairs, everything stays organized in a
          single dashboard.
        </p>
        <div className="auth-actions" style={{ marginTop: "16px" }}>
          <Link className="btn btn-primary" to="/signup">
            Get Started
          </Link>
          <Link className="btn btn-outline" to="/login">
            Continue as Existing User
          </Link>
        </div>
      </section>

      <section className="service-grid">
        <article className="service-card">
          <h3>For Clients</h3>
          <p>
            Create service requests with complete vehicle details, preferred service date, and issue notes.
            Monitor booking progress and updates directly from your dashboard.
          </p>
        </article>
        <article className="service-card">
          <h3>For Garages</h3>
          <p>
            Receive customer requests in a structured view, review vehicle/service information quickly, and
            update booking progress instantly for better communication.
          </p>
        </article>
        <article className="service-card">
          <h3>Reliable Workflow</h3>
          <p>
            Secure login, role-based access, and structured data storage powered by your backend and MySQL keep
            every booking traceable and reliable.
          </p>
        </article>
        <article className="service-card">
          <h3>Services Supported</h3>
          <p>General servicing, oil changes, brake checks, battery support, diagnostics, and repair follow-ups.</p>
        </article>
        <article className="service-card">
          <h3>Simple Booking Journey</h3>
          <p>Sign up, create booking, garage review, live status updates, and completion tracking in one flow.</p>
        </article>
        <article className="service-card">
          <h3>Fast & Transparent</h3>
          <p>Clear booking records, visible status timeline, and fewer call-backs between customers and garages.</p>
        </article>
      </section>

      <section className="panel">
        <h2>Why Choose This Platform?</h2>
        <p className="muted">
          This system is designed for everyday service operations with clean data handling, quick status
          visibility, and role-specific dashboards for both clients and garages.
        </p>
      </section>
    </div>
  );
}