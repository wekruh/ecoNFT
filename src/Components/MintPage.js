import React, { useState } from "react";
import "../App.css";
import { PublicKey, Transaction, SystemProgram, Connection } from "@solana/web3.js";
import { Buffer } from "buffer"; // Import Buffer polyfill

// Make Buffer globally available
window.Buffer = Buffer;

function MintPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showMintModal, setShowMintModal] = useState(false);
  const [nftType, setNftType] = useState("");

  // Use a direct RPC URL for devnet (use this instead of clusterApiUrl("devnet"))
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const isPhantomInstalled = () => {
    return window?.solana?.isPhantom;
  };

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
    } catch (err) {
      console.error("Error connecting to Phantom Wallet:", err);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    alert("Wallet disconnected!");
  };

  const openMintModal = (type) => {
    if (!walletConnected) {
      alert("Please connect your wallet before minting an NFT.");
      return;
    }
    setNftType(type);
    setShowMintModal(true);
  };

  const closeMintModal = () => {
    setShowMintModal(false);
    setNftType("");
  };

  // Confirm Mint Action
  const confirmMint = async () => {
    try {
      // Define the recipient address
      const recipientAddress = new PublicKey("6CV1KuzTuH7AGzdqqbqrBjfkzriSsLBEQQF93GGHX619");

      // Fetch the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create the transaction and set the recentBlockhash
      const transaction = new Transaction({
        recentBlockhash: blockhash,  // Set the recent blockhash
        feePayer: window.solana.publicKey,  // Set fee payer
      }).add(
        SystemProgram.transfer({
          fromPubkey: window.solana.publicKey,
          toPubkey: recipientAddress,
          lamports: 0.5 * 1e9, // 0.5 SOL in lamports (1 SOL = 1 billion lamports)
        })
      );

      // Check if Phantom is connected and has a public key
      if (!window.solana.publicKey) {
        throw new Error("Phantom wallet is not connected properly.");
      }

      // Send the transaction using Phantom wallet
      const { signature } = await window.solana.signAndSendTransaction(transaction);

      // Check if the signature is valid
      if (!signature) {
        throw new Error("Failed to get a valid transaction signature.");
      }

      // Confirm transaction
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      if (confirmation.value.err) {
        throw new Error("Transaction failed.");
      }

      alert(`Successfully minted a ${nftType} and sent 0.5 SOL to the recipient!`);
      closeMintModal();
    } catch (err) {
      console.error("Error confirming mint:", err);
      alert(`Failed to send SOL: ${err.message}`);
    }
  };

  return (
    <div>
      <header>
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/images/logoo.png`} alt="EcoNFT Energy Logo" />
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

      <section id="hero">
        <h1>Mint Your Own Renewable Energy NFTs</h1>
        <p>Choose your favorite renewable energy asset and mint it as an NFT!</p>
      </section>

      <section id="mint-nfts">
        <h2>Mint Energy NFTs</h2>
        <div className="nft-mint-options">
          <div className="mint-card">
            <img src={`${process.env.PUBLIC_URL}/images/solar-panel.png`} alt="Solar Panel NFT" />
            <h3>Solar Panel NFT</h3>
            <button className="mint-button" onClick={() => openMintModal("Solar Panel NFT")}>
              Mint Solar Panel NFT
            </button>
          </div>
          <div className="mint-card">
            <img src={`${process.env.PUBLIC_URL}/images/wind-turbine.png`} alt="Wind Turbine NFT" />
            <h3>Wind Turbine NFT</h3>
            <button className="mint-button" onClick={() => openMintModal("Wind Turbine NFT")}>
              Mint Wind Turbine NFT
            </button>
          </div>
        </div>
      </section>

      {showMintModal && (
        <div
          id="mint-modal"
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMintModal();
          }}
        >
          <div className="modal-content">
            <span className="close-btn" onClick={closeMintModal}>&times;</span>
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

      <footer>
        <p>&copy; 2024 EcoNFT Energy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MintPage;