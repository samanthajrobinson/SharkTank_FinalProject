import { Link } from 'react-router-dom';
import HeroCanvas from '../components/HeroCanvas.jsx';

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-copy">
            <p className="eyebrow">AI styling meets cozy coffeehouse design</p>
            <h1>Generate polished outfits in seconds.</h1>
            <p>
              FitMatch helps students and busy professionals create an outfit based on occasion,
              weather, and closet pieces they already own.
            </p>
            <div className="hero-actions">
              <Link className="button-link" to="/generator">Start Styling</Link>
              <Link className="ghost-button" to="/saved">View Saved Looks</Link>
            </div>
          </div>
          <HeroCanvas />
        </div>
      </section>

      <section className="container feature-grid">
        <article className="card">
          <h2>Why it matters</h2>
          <p>Users waste time deciding what to wear. FitMatch reduces decision fatigue with quick, tailored outfit suggestions.</p>
        </article>
        <article className="card">
          <h2>Media requirement</h2>
          <p>This project uses images in outfit cards and a custom canvas mood board to satisfy multiple web media types.</p>
        </article>
        <article className="card">
          <h2>Persistent experience</h2>
          <p>Saved looks remain available through local storage and the protected API for logged-in users.</p>
        </article>
      </section>
    </main>
  );
}
