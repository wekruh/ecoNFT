import React, { useState } from "react";
import "../App.css";
import { PublicKey } from "@solana/web3.js";

const ManageNFTs = () => {
  const [showSellModal, setShowSellModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [sellPrice, setSellPrice] = useState("");
  const [leasePrice, setLeasePrice] = useState("");
  const [leaseDays, setLeaseDays] = useState("");
  const [walletConnected, setWalletConnected] = useState(false); // Tracks wallet connection status
  const [walletAddress, setWalletAddress] = useState(""); // Stores the connected wallet address

  // Check if Phantom Wallet is installed
  const isPhantomInstalled = () => {
    return window?.solana?.isPhantom;
  };

  // Connect to Phantom Wallet
  const connectWallet = async () => {
    if (!isPhantomInstalled()) {
      alert("Phantom Wallet is not installed. Please install it from https://phantom.app/");
      return;
    }

    try {
      const response = await window.solana.connect(); // Requests wallet connection
      const address = new PublicKey(response.publicKey.toString());
      setWalletConnected(true);
      setWalletAddress(address.toString());
      alert(`Wallet connected: ${address.toString()}`);
    } catch (err) {
      console.error("Error connecting to Phantom Wallet:", err);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    alert("Wallet disconnected!");
  };

  // Example owned NFTs
  const ownedNFTs = [
    { id: 1, name: "Solar Panel NFT", image: "/images/solar-panel.png" },
    { id: 2, name: "Wind Turbine NFT", image: "/images/wind-turbine.png" },
  ];

  // Open Sell Modal
  const openSellModal = (nft) => {
    setCurrentNFT(nft);
    setShowSellModal(true);
  };

  // Open Lease Modal
  const openLeaseModal = (nft) => {
    setCurrentNFT(nft);
    setShowLeaseModal(true);
  };

  // Close Modals
  const closeSellModal = () => setShowSellModal(false);
  const closeLeaseModal = () => setShowLeaseModal(false);

  // Handle Sell Confirmation
  const handleSell = () => {
    alert(`Sold ${currentNFT.name} for $${sellPrice}!`);
    closeSellModal();
  };

  // Handle Lease Confirmation
  const handleLease = () => {
    alert(
      `Leased ${currentNFT.name} for $${leasePrice}/day for ${leaseDays} days!`
    );
    closeLeaseModal();
  };

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
        <button id="connect-wallet" onClick={walletConnected ? disconnectWallet : connectWallet}>
          {walletConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </header>

      {/* Owned NFTs Section */}
      <section id="owned-nfts">
        <h2>Your Owned NFTs</h2>
        <p>Manage your NFTs by selling them or leasing them to others for passive income.</p>
        <div className="nft-cards">
          {ownedNFTs.map((nft) => (
            <div key={nft.id} className="nft-card">
              <img src={nft.image} alt={nft.name} />
              <h3>{nft.name}</h3>
              <button onClick={() => openSellModal(nft)}>Sell</button>
              <button onClick={() => openLeaseModal(nft)}>Lease</button>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Information Section */}
      <section id="info-section">
        <h2>Why Manage Your NFTs?</h2>
        <ul>
          <li>💸 Maximize your income by selling NFTs at a profit.</li>
          <li>🔗 Lease NFTs to generate daily rental income from other users.</li>
          <li>📈 Track the performance and earnings of your NFTs.</li>
        </ul>
      </section>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeSellModal}>
              &times;
            </span>
            <h2>Sell {currentNFT.name}</h2>
            <input
              type="number"
              placeholder="Enter price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
            <button onClick={handleSell}>Sell</button>
          </div>
        </div>
      )}

      {/* Lease Modal */}
      {showLeaseModal && (
  <div
    className="modal"
    onClick={(e) => e.target === e.currentTarget && closeLeaseModal()} // Close modal on outside click
  >
    <div className="modal-content">
      <span className="close-btn" onClick={closeLeaseModal}>
        &times;
      </span>
      <h2>Lease {currentNFT?.name}</h2>
      <input
        type="number"
        placeholder="Daily rent price"
        value={leasePrice}
        onChange={(e) => setLeasePrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of days"
        value={leaseDays}
        onChange={(e) => setLeaseDays(e.target.value)}
      />
      <button onClick={handleLease}>Lease</button>
    </div>
  </div>
)}


      {/* Footer */}
      <footer>
        <p>&copy; 2024 EcoNFT Energy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ManageNFTs;
