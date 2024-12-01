import React, { useState } from "react";
import "../App.css";
import { PublicKey } from "@solana/web3.js";

function MintPage() {
  const [walletConnected, setWalletConnected] = useState(false); // Tracks wallet connection status
  const [walletAddress, setWalletAddress] = useState(""); // Stores the connected wallet address
  const [showMintModal, setShowMintModal] = useState(false); // Tracks modal visibility
  const [nftType, setNftType] = useState(""); // Stores the selected NFT type

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

  // Open Mint Modal
  const openMintModal = (type) => {
    if (!walletConnected) {
      alert("Please connect your wallet before minting an NFT.");
      return;
    }
    setNftType(type);
    setShowMintModal(true);
  };

  // Close Mint Modal
  const closeMintModal = () => {
    setShowMintModal(false);
    setNftType("");
  };

  // Confirm Mint Action
  const confirmMint = () => {
    alert(`Successfully minted a ${nftType}!`);
    closeMintModal();
  };

  return (
    <div>
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

      {/* Hero Section */}
      <section id="hero">
        <h1>Mint Your Own Renewable Energy NFTs</h1>
        <p>Choose your favorite renewable energy asset and mint it as an NFT!</p>
      </section>

      {/* Mint NFTs Section */}
      <section id="mint-nfts">
        <h2>Mint Energy NFTs</h2>
        <div className="nft-mint-options">
          <div className="mint-card">
          <img src={`${process.env.PUBLIC_URL}/images/solar-panel.png`} alt="Solar Panel NFT" />
            <h3>Solar Panel NFT</h3>
            <button
              className="mint-button"
              onClick={() => openMintModal("Solar Panel NFT")}
            >
              Mint Solar Panel NFT
            </button>
          </div>
          <div className="mint-card">
          <img src={`${process.env.PUBLIC_URL}/images/wind-turbine.png`} alt="Wind Turbine NFT" />            <h3>Wind Turbine NFT</h3>
            <button
              className="mint-button"
              onClick={() => openMintModal("Wind Turbine NFT")}
            >
              Mint Wind Turbine NFT
            </button>
          </div>
        </div>
      </section>

      {/* Mint Modal */}
      {showMintModal && (
        <div
          id="mint-modal"
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMintModal(); // Close modal when clicking outside
          }}
        >
          <div className="modal-content">
            <span className="close-btn" onClick={closeMintModal}>
              &times;
            </span>
            <h2>Confirm Mint</h2>
            <p>Are you sure you want to mint a {nftType}?</p>
            <div className="modal-buttons">
              <button id="confirm-mint" onClick={confirmMint}>
                Confirm Mint
              </button>
              <button className="cancel-btn" onClick={closeMintModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>&copy; 2024 EcoNFT Energy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MintPage;