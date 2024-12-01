import React, { useState } from "react";
import "../App.css";
import { PublicKey, SystemProgram, Transaction, Connection, Keypair } from "@solana/web3.js";

const ManageNFTs = () => {
  const [showSellModal, setShowSellModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [sellPrice, setSellPrice] = useState("");
  const [leasePrice, setLeasePrice] = useState("");
  const [leaseDays, setLeaseDays] = useState("");
  const [walletConnected, setWalletConnected] = useState(false); // Tracks wallet connection status
  const [walletAddress, setWalletAddress] = useState(""); // Stores the connected wallet address
  const [userBalance, setUserBalance] = useState(null); // To track user's SOL balance

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
      // Fetch and set user's balance
      await updateBalance(address);
    } catch (err) {
      console.error("Error connecting to Phantom Wallet:", err);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setUserBalance(null); // Reset balance on disconnect
    alert("Wallet disconnected!");
  };

  // Fetch user's SOL balance
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
  const handleSell = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet before proceeding with the transaction.");
      return;
    }

    try {
      // Create a connection to Solana devnet
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      // Get the public key from Phantom Wallet (user's connected wallet)
      const payerPublicKey = new PublicKey(walletAddress);

      // Define the recipient's public key (for example, your static wallet or another address)
      const recipientAddress = payerPublicKey; // For this demo, it's the same wallet. Replace with another address if needed

      // Fetch the recent blockhash to include in the transaction
      const { blockhash } = await connection.getLatestBlockhash();

      // Convert SOL to lamports (1 SOL = 1 billion lamports)
      const lamports = parseFloat(sellPrice) * 1e9; // Ensure the price is converted to lamports

      // Check if user has enough balance
      const userBalanceInLamports = await connection.getBalance(payerPublicKey);
      if (userBalanceInLamports < lamports) {
        alert("Insufficient balance. Please check your balance.");
        return;
      }

      // Create the transaction
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: payerPublicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: payerPublicKey,
          toPubkey: recipientAddress,
          lamports: lamports, // Use the converted lamport value
        })
      );

      // Log the transaction for debugging purposes
      console.log("Transaction created:", transaction);

      // Sign the transaction using Phantom Wallet
      const signedTransaction = await window.solana.signTransaction(transaction);

      // Send the signed transaction to the network
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      // Wait for the transaction confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed");

      if (confirmation.value.err) {
        console.error("Transaction failed:", confirmation.value.err);
        alert("Transaction failed. Please try again.");
      } else {
        console.log("Transaction confirmed:", confirmation);
        alert(`Successfully sold ${currentNFT.name} and transferred ${sellPrice} SOL!`);
        
        // After the transaction, update the balance
        await updateBalance(payerPublicKey);

        closeSellModal();
      }

    } catch (err) {
      console.error("Error during the sell transaction:", err);
      alert("Failed to process the transaction. Please try again.");
    }
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
            <li><a href="/lease-nft">Rent NFTs</a></li>
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
              placeholder="Enter price (SOL)"
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
  
  export default ManageNFTs;