import { Link } from "react-router-dom";
import "./LandingPage.css";

const services = [
  ["01", "Routine servicing", "Keep your vehicle at its best with regular maintenance and oil changes."],
  ["02", "Diagnostics & repairs", "Describe the issue and give your garage the details they need to get started."],
  ["03", "Brakes & battery", "Arrange essential checks for the components you depend on every day."]
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header landing-container">
        <Link className="landing-brand" to="/" aria-label="Smart Vehicle Service home">
          <span className="brand-symbol" aria-hidden="true">S<span>.</span></span>
          <span>SMART VEHICLE<span className="brand-caption">SERVICE & CARE</span></span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#services">Our services</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="landing-actions">
          <Link className="landing-login" to="/login">Log in</Link>
          <Link className="landing-button landing-button-dark" to="/signup">Get started <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <main>
        <section className="landing-hero landing-container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="landing-eyebrow"><span className="accent-line" /> A BETTER WAY TO CARE FOR YOUR CAR</p>
            <h1 id="hero-title">Less hassle.<br />More miles.<br /><span>Service, simplified.</span></h1>
            <p className="hero-description">Your next service starts here. Book a visit, keep up with repairs, and manage your vehicle care — all in one place.</p>
            <div className="hero-actions">
              <Link className="landing-button landing-button-accent" to="/signup">Book your service <span aria-hidden="true">↗</span></Link>
              <a className="landing-text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-benefits"><span>✓ Easy online booking</span><span>✓ Clear progress updates</span></div>
          </div>
          <div className="hero-visual" aria-label="Illustration of vehicle service tracking">
            <div className="visual-topline"><span>YOUR CAR. OUR PRIORITY.</span><span aria-hidden="true">↗</span></div>
            <div className="vehicle-orbit" aria-hidden="true" />
            <svg className="vehicle-illustration" viewBox="0 0 600 310" role="img" aria-label="Side profile of a modern car">
              <defs>
                <linearGradient id="car-body" x1="0" y1="0" x2="0.2" y2="1"><stop stopColor="#fbfcfd"/><stop offset="0.5" stopColor="#c8d2da"/><stop offset="1" stopColor="#83929e"/></linearGradient>
                <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3c5665"/><stop offset="1" stopColor="#152630"/></linearGradient>
              </defs>
              <ellipse cx="308" cy="254" rx="246" ry="17" fill="#000" opacity=".25"/>
              <path d="M53 205 65 169 152 145 214 91 Q225 82 251 81 L349 84 Q376 86 402 107 L454 149 520 164 Q544 170 550 190 L557 221 536 233 71 231 47 220Z" fill="url(#car-body)" stroke="#e1e8ed" strokeWidth="2"/>
              <path d="m177 145 53-48 58-1-2 50Zm123-49 47 2q24 1 43 18l35 31-123-1Z" fill="url(#car-glass)"/>
              <path d="m302 154 1 68m125-67 14 60M85 191l420 4M178 224h235" fill="none" stroke="#657681" strokeWidth="2"/>
              <path d="m70 175 54-8-13 16-47 6m446-14 27 9 7 13-31-5" fill="#e2f8ff"/>
              <path d="m65 208 41 1m390 0 45 2" stroke="#23343f" strokeWidth="7"/>
              <path d="m264 164 17 0m112 0 17 0" stroke="#465967" strokeWidth="4" strokeLinecap="round"/>
              {[149, 456].map(x => <g key={x}><circle cx={x} cy="225" r="43" fill="#111b22"/><circle cx={x} cy="225" r="28" fill="#81919b"/><circle cx={x} cy="225" r="21" fill="#283a46"/><path d={`M${x} 205v40m-20-20h40m-34-14 28 28m-28 0 28-28`} stroke="#b7c4cb" strokeWidth="4"/><circle cx={x} cy="225" r="7" fill="#cbd6dc"/></g>)}
            </svg>
            <div className="service-preview">
              <div className="preview-icon" aria-hidden="true">✓</div>
              <div><span className="preview-label">SERVICE JOURNEY</span><strong>Stay in the driver's seat.</strong><p>From booking to completion.</p></div>
              <span className="preview-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="visual-bottomline"><span>CARE THAT KEEPS YOU MOVING</span><span>01 / 03</span></div>
          </div>
        </section>

        <section className="landing-services landing-container" id="services" aria-labelledby="services-title">
          <div className="landing-section-heading"><div><p className="landing-eyebrow">BUILT AROUND YOUR VEHICLE</p><h2 id="services-title">Everyday care. Expert attention.</h2></div><p>From the essentials to the unexpected,<br />make your next service easier to manage.</p></div>
          <div className="landing-service-grid">{services.map(([number, title, description]) => <article className="landing-service-card" key={number}><span className="service-number">{number}</span><h3>{title}</h3><p>{description}</p><Link to="/signup" aria-label={`Book ${title.toLowerCase()}`}>Explore service <span aria-hidden="true">↗</span></Link></article>)}</div>
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
