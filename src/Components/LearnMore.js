import React from "react";
import "../App.css";

function LearnMore() {
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

      {/* About Section */}
      <section id="about">
        <h1>Learn More About EcoNFT Energy</h1>
        <p>
          EcoNFT Energy is a platform that combines renewable energy with blockchain technology.
          Own real-world renewable energy assets like solar panels and wind turbines as NFTs,
          and earn passive income through their energy generation.
        </p>
      </section>

      {/* Features Section */}
      <section id="features">
        <h2>Our Key Features</h2>
        <div className="features">
          <div className="feature">
            <h3>Buy NFTs</h3>
            <p>Purchase NFTs representing solar panels and wind turbines. Each NFT corresponds to a real-world asset.</p>
          </div>
          <div className="feature">
            <h3>Rent Your NFTs</h3>
            <p>Earn rental income by leasing your NFTs to other users on the platform.</p>
          </div>
          <div className="feature">
            <h3>Earn Passive Income</h3>
            <p>Receive payouts based on the energy produced by your renewable energy NFTs.</p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs">
        <h2>Frequently Asked Questions</h2>
        <div className="faq">
          <h3>How does renting work?</h3>
          <p>
            When you lease your NFTs to another user, they pay you a daily rent.
            You can specify the rental price and duration when setting up a lease.
          </p>
        </div>
        <div className="faq">
          <h3>How do I earn income?</h3>
          <p>
            Each NFT represents a real-world solar panel or wind turbine.
            You earn passive income based on the energy generated by your asset.
          </p>
        </div>
        <div className="faq">
          <h3>How do I get started?</h3>
          <p>
            Connect your wallet, mint your first NFT, and start earning passive income or leasing your NFTs to others.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 EcoNFT Energy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LearnMore;
