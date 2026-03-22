<main className="site-page">
  <div className="site-container">
    <section className="hero-card">
      <div className="kicker-pill">2026</div>
      <h1 className="hero-title">FitMatch</h1>
      <p className="hero-text">
        Browse community favorite outfits from all users and get inspired by
        saved looks across FitMatch.
      </p>
    </section>

    <section className="section-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Community Favorites</h2>
          <p className="section-subtext">Favorited outfits from all users.</p>
        </div>
        <span className="section-subtext">
          {favoriteOutfits.length} saved look{favoriteOutfits.length === 1 ? "" : "s"}
        </span>
      </div>

      {message ? <div className="status-error">{message}</div> : null}

      {favoriteOutfits.length === 0 ? (
        <div className="empty-state">No favorite outfits yet.</div>
      ) : (
        <div className="cards-grid">
          {/* cards */}
        </div>
      )}
    </section>

    <footer className="footer">
      FitMatch • CS 341 • Samantha Robinson
    </footer>
  </div>
</main>