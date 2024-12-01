import React from "react";
import "../App.css";

function HomePage() {
  return (
    <div>
      {/* Header */}
      <header>
        <div className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/images/logoo.png`}
            alt="EcoNFT Energy Logo"
          />
        </div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/mint-nfts">Mint NFTs</a></li>
            <li><a href="/manage-nfts">Manage NFTs</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero">
        <h1>Welcome to EcoNFT Energy</h1>
        <p>
          Own real-world solar panels and wind turbines as NFTs, earn passive income, and contribute to a sustainable future!
        </p>
        <div className="cta-buttons">
          <a href="/mint-nfts" className="cta-button">Start Buying</a>
          <a href="/learn-more" className="cta-button secondary">Learn More</a>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <h2>How It Works</h2>
        <div className="features">
          <div className="feature">
            <h3>Buy NFTs</h3>
            <p>Mint your own NFTs representing real-world solar panels and wind turbines.</p>
          </div>
          <div className="feature">
            <h3>Rent Your NFTs</h3>
            <p>Lease your NFTs to other users and earn daily rent income.</p>
          </div>
          <div className="feature">
            <h3>Earn Passive Income</h3>
            <p>Get paid for the energy your solar panels and wind turbines generate.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us">
        <h2>Why Choose EcoNFT Energy?</h2>
        <ul>
          <li>💡 Contribute to renewable energy and sustainability.</li>
          <li>💸 Earn passive income effortlessly.</li>
          <li>🌍 Own real-world renewable energy assets.</li>
          <li>📈 Join a growing community of energy enthusiasts.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 EcoNFT Energy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
