import React, { useState } from "react";
import "../App.css";
import { PublicKey, SystemProgram, Transaction, Connection } from "@solana/web3.js";

const LeaseNFT = () => {
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [leasePrice, setLeasePrice] = useState("");
  const [leaseDays, setLeaseDays] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userBalance, setUserBalance] = useState(null);

  const isPhantomInstalled = () => window?.solana?.isPhantom;

  // Connect wallet to Phantom
  const connectWallet = async () => {
    if (!isPhantomInstalled()) {
      alert("Phantom Wallet is not installed. Please install it from https://phantom.app/");
      return;
    }

    try {
      const response = await window.solana.connect();
      const address = new PublicKey(response.publicKey.toString());
      setWalletConnected(true);
      setWalletAddress(address.toString());
      alert(`Wallet connected: ${address.toString()}`);
      await updateBalance(address);
    } catch (err) {
      console.error("Error connecting to Phantom Wallet:", err);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setUserBalance(null);
    alert("Wallet disconnected!");
  };

  // Update user's SOL balance
  const updateBalance = async (address) => {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const balance = await connection.getBalance(address);
    setUserBalance(balance / 1e9); // Convert lamports to SOL
  };

  // Example owned NFTs
  const ownedNFTs = [
    { id: 1, name: "Solar Panel NFT", image: "/images/solar-panel.png" },
    { id: 2, name: "Wind Turbine NFT", image: "/images/wind-turbine.png" },
  ];

  // Open modal to lease NFT
  const openLeaseModal = (nft) => {
    setCurrentNFT(nft);
    setShowLeaseModal(true);
  };

  // Close modal
  const closeLeaseModal = () => setShowLeaseModal(false);

  // Handle NFT lease
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
            <li><a href="/lease-nft">Lease NFTs</a></li>
          </ul>
        </nav>
        <button id="connect-wallet" onClick={walletConnected ? disconnectWallet : connectWallet}>
          {walletConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </header>

      {/* Lease NFTs Section */}
      <section id="lease-nfts">
        <h2>Lease Your NFTs</h2>
        <p>Lease your NFTs to other users and earn passive income.</p>
        
        {/* NFT Cards */}
        <div className="nft-cards-container">
          <div className="nft-cards-scroll">
            {ownedNFTs.map((nft) => (
              <div key={nft.id} className="lease-nft-card">
                <img src={nft.image} alt={nft.name} />
                <div className="card-details">
                  <h3>{nft.name}</h3>
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
                  <button onClick={() => openLeaseModal(nft)}>Lease</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lease Modal */}
      {showLeaseModal && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && closeLeaseModal()} // Close modal
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

export default LeaseNFT;