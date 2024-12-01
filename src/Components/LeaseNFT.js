import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PublicKey, Connection } from "@solana/web3.js";
import "../App.css";

const LeaseNFT = () => {
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userBalance, setUserBalance] = useState(null);
  const [leasePrice, setLeasePrice] = useState(0.5); // Default lease price in SOL
  const [leaseDays, setLeaseDays] = useState(1); // Default lease duration

  const location = useLocation();
  const leaseData = location.state || {};

  // leaseData'dan leasePrice ve leaseDays değerlerini alıyoruz
  useEffect(() => {
    if (leaseData) {
      if (leaseData.leasePrice) setLeasePrice(leaseData.leasePrice);
      if (leaseData.leaseDays) setLeaseDays(leaseData.leaseDays);
    }
  }, [leaseData]);

  const isPhantomInstalled = () => window?.solana?.isPhantom;

  // Cüzdanı bağlama işlemi
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
      await updateBalance(address); // Bakiyeyi güncelle
    } catch (err) {
      console.error("Error connecting to Phantom Wallet:", err);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // Cüzdanı ayırma işlemi
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setUserBalance(null);
    alert("Wallet disconnected!");
  };

  // Cüzdan bakiyesini alma
  const updateBalance = async (address) => {
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const balance = await connection.getBalance(address);
      setUserBalance(balance / 1e9); // Solana'da 1 SOL = 1e9 Lamports, bakiyeyi SOL cinsine çeviriyoruz
    } catch (err) {
      console.error("Error fetching balance:", err);
      alert("Failed to fetch balance.");
    }
  };

  useEffect(() => {
    if (leaseData) {
      // Veriyi leaseData'dan alıyoruz
      if (leaseData.leasePrice) setLeasePrice(leaseData.leasePrice);
      if (leaseData.leaseDays) setLeaseDays(leaseData.leaseDays);
    }
  }, [leaseData]);

  // Yeni NFT kartı oluşturulması
  const newNFT = {
    id: 3,
    name: leaseData.nftName || "Default NFT",
    image: "/images/default-nft.png", // Placeholder image
    leasePrice,
    leaseDays,
  };

  // Kiralama işlemi başlatma
  const openLeaseModal = (nft) => {
    setCurrentNFT(nft);
    setShowLeaseModal(true);
  };

  const closeLeaseModal = () => setShowLeaseModal(false);

  const handleLease = () => {
    alert(
      `Leased ${currentNFT?.name || newNFT.name} for ${leasePrice} SOL/day for ${leaseDays} days!`
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

      {/* Main Content */}
      <section id="lease-nfts">
        <h2>Lease Your NFTs</h2>
        <p>Lease your NFTs to other users and earn passive income.</p>

        <div className="nft-cards-container">
          <div className="nft-cards-scroll">
            {/* Display the new card */}
            <div key={newNFT.id} className="lease-nft-card">
              <img src={newNFT.image} alt={newNFT.name} />
              <div className="card-details">
                <h3>{newNFT.name}</h3>
                <p>Price: {newNFT.leasePrice} SOL/day</p>
                <p>Duration: {newNFT.leaseDays} day(s)</p>
                <button onClick={() => openLeaseModal(newNFT)}>Lease</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lease Modal */}
      {showLeaseModal && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && closeLeaseModal()}
        >
          <div className="modal-content">
            <span className="close-btn" onClick={closeLeaseModal}>
              &times;
            </span>
            <h2>Lease {currentNFT?.name || newNFT.name}</h2>
            <p>Price: {leasePrice} SOL/day</p>
            <p>Duration: {leaseDays} days</p>
            <button onClick={handleLease}>Confirm Lease</button>
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