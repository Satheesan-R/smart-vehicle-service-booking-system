import { Link } from "react-router-dom";
import "./LandingPage.css";
import garagePhoto from "../assets/images.jpg";

const services = [
  ["01", "Oil Change", "Keep your engine running smoothly with routine oil and filter maintenance."],
  ["02", "General Service", "Give your vehicle regular attention with a general maintenance visit."],
  ["03", "Brake Service", "Book an inspection for brake wear, noise, or changes in stopping performance."],
  ["04", "Engine Diagnostics", "Help your garage investigate warning lights and engine performance issues."],
  ["05", "Battery Check", "Arrange a battery check when starting becomes slow or unreliable."]
];
export default function LandingPage() {
  return (
    <div className="landing-page" id="home">
      <header className="landing-header landing-container">
        <Link className="landing-brand" to="/" aria-label="Smart Vehicle Service home">
          <span className="brand-symbol" aria-hidden="true">S<span>.</span></span>
          <span>Auto<span className="brand-blue">Care</span><span className="brand-caption">SMART VEHICLE SERVICE</span></span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#home">Home</a><a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a><a href="#about">About</a>
        </nav>
        <div className="landing-actions">
          <Link className="landing-login" to="/login">Log in</Link>
          <Link className="landing-button landing-button-dark" to="/signup">Book a Service <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <main>
        <section className="landing-hero landing-container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-badge">● Smart vehicle servicing & progress updates</p>
            <h1 id="hero-title">Your Vehicle. Our Care.<br /><span>Smarter Service.</span></h1>
            <p className="hero-description">Book your vehicle service online, track repair progress, and keep your service requests together in one simple dashboard.</p>
            <div className="hero-actions"><Link className="landing-button landing-button-accent" to="/signup">Book a Service →</Link><a className="landing-button hero-secondary" href="#services">Explore Services</a></div>
            <div className="hero-benefits"><span>✓ Online booking</span><span>✓ Garage updates</span><span>✓ Service history</span></div>
            <div className="hero-quick-start"><span className="quick-icon" aria-hidden="true">↗</span><div><strong>Your next service starts here</strong><p>Create an account, add your vehicle, and choose a date.</p></div><Link to="/signup">Get started →</Link></div>
          </div>
          <div className="hero-photo-wrap"><img src={garagePhoto} alt="A garage technician discussing vehicle servicing with a customer" fetchPriority="high" /><div className="hero-photo-label"><span className="photo-label-icon" aria-hidden="true">✓</span><div><strong>Care you can keep up with.</strong><p>From your first booking to the final update.</p></div></div></div>
        </section>
        <section className="landing-summary" aria-label="Platform highlights"><div className="landing-container summary-grid">{[["↗", "Online", "Service booking"], ["▦", "One place", "Your service requests"], ["✓", "Stay informed", "Garage progress updates"], ["→", "For everyone", "Drivers & garage teams"]].map(([icon, title, caption]) => <div className="summary-item" key={title}><span aria-hidden="true">{icon}</span><div><strong>{title}</strong><p>{caption}</p></div></div>)}</div></section>
        <section className="landing-services landing-container" id="services" aria-labelledby="services-title">
          <div className="landing-section-heading"><div><p className="landing-eyebrow">CARE FOR EVERY MILE</p><h2 id="services-title">Comprehensive Maintenance & Repair Services</h2><p className="section-description">From routine maintenance to diagnostics, find the right care for your vehicle.</p></div><Link className="section-link" to="/signup">Book a service →</Link></div>
          <div className="landing-service-grid">{services.map(([number, title, description]) => <article className="landing-service-card" key={number}><span className="service-number" aria-hidden="true">{["◈", "✓", "◎", "⚙", "ϟ"][Number(number) - 1]}</span><h3>{title}</h3><p>{description}</p><Link to="/signup" aria-label={`Book ${title.toLowerCase()}`}>Book service <span aria-hidden="true">→</span></Link></article>)}</div>
        </section>
        <section className="landing-process landing-container" id="how-it-works" aria-labelledby="process-title">
          <div><p className="landing-eyebrow">SIMPLE FROM THE START</p><h2 id="process-title">Three steps.<br />One smoother experience.</h2><p className="process-intro">More clarity at every stage of your service.</p></div>
          <ol className="process-steps">
            <li><span>01</span><div><h3>Make it yours</h3><p>Create your account to manage your vehicle's service needs.</p></div></li>
            <li><span>02</span><div><h3>Book your visit</h3><p>Add your vehicle details, preferred date, and what needs attention.</p></div></li>
            <li><span>03</span><div><h3>Follow the progress</h3><p>View garage updates and track your booking through to completion.</p></div></li>
          </ol>
        </section>
        <section className="landing-garage landing-container"><div><p className="landing-eyebrow">FOR GARAGE TEAMS</p><h2>Great service starts with better organization.</h2><p>Manage requests, update repair progress, and keep customers in the loop.</p></div><Link className="landing-button landing-button-accent" to="/signup">Register your garage <span aria-hidden="true">↗</span></Link></section>
      </main>
      <footer className="landing-footer landing-container"><span>Smart Vehicle Service<span className="footer-dot">.</span></span><p>Better care. Every journey.</p><Link to="/login">Access your dashboard ↗</Link></footer>
    </div>
  );
}



