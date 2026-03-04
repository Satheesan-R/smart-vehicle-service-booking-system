import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">


      <section className="hero">
        <h1>Professional Vehicle Service Booking Platform</h1>
        <p>
          Book servicing online, track updates in real time, and let garages manage every request in one
          transparent workflow.
        </p>
      </section>

      <section className="service-grid">
        <article className="service-card">
          <h3>For Clients</h3>
          <p>Create service requests with vehicle details and monitor booking status from your dashboard.</p>
        </article>
        <article className="service-card">
          <h3>For Garages</h3>
          <p>Receive client requests in a clear table, review customer details, and update progress instantly.</p>
        </article>
        <article className="service-card">
          <h3>Reliable Workflow</h3>
          <p>Secure login, role-based access, and structured data storage powered by your backend and MySQL.</p>
        </article>
      </section>
    </div>
  );
}