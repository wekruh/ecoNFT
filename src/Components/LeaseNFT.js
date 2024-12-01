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
  const [leasedNFTs, setLeasedNFTs] = useState([]); // State to store the leased NFTs

  const location = useLocation();
  const leaseData = location.state || {}; // Manage sayfasından gelen veriler

  // Load stored NFTs on initial render
  useEffect(() => {
    const storedNFTs = JSON.parse(localStorage.getItem("leasedNFTs")) || [];
    setLeasedNFTs(storedNFTs);
  }, []);

  // Handle new cards from Manage
  useEffect(() => {
    if (leaseData?.name) {
      const newNFT = {
        id: leaseData.id || leasedNFTs.length + 1,
        name: leaseData.name,
        image: leaseData.image || "/images/default-nft.png",
        leasePrice: leaseData.leasePrice || 0.5,
        leaseDays: leaseData.leaseDays || 7,
      };

      setLeasedNFTs((prevLeasedNFTs) => {
        // Prevent duplicates
        const isDuplicate = prevLeasedNFTs.some((nft) => nft.name === newNFT.name);
        if (!isDuplicate) {
          const updatedNFTs = [...prevLeasedNFTs, newNFT];
          localStorage.setItem("leasedNFTs", JSON.stringify(updatedNFTs));
          return updatedNFTs;
        }
        return prevLeasedNFTs;
      });
    }
  }, [leaseData]);

  const isPhantomInstalled = () => window?.solana?.isPhantom;

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

  const updateBalance = async (address) => {
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const balance = await connection.getBalance(address);
      setUserBalance(balance / 1e9);
    } catch (err) {
      console.error("Error fetching balance:", err);
      alert("Failed to fetch balance.");
    }
  };

  const openLeaseModal = (nft) => {
    setCurrentNFT(nft);
    setShowLeaseModal(true);
  };

  const closeLeaseModal = () => setShowLeaseModal(false);

  const handleLease = () => {
    alert(
      `Leased ${currentNFT?.name || "Default NFT"} for ${leasePrice} SOL/day for ${leaseDays} days!`
    );
    closeLeaseModal();
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
            <li><a href="/mint-nfts">Buy NFTs</a></li>
            <li><a href="/manage-nfts">Manage NFTs</a></li>
            <li><a href="/lease-nft">Rent NFTs</a></li>
          </ul>
        </nav>
        <button id="connect-wallet" onClick={walletConnected ? disconnectWallet : connectWallet}>
          {walletConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </header>

      <section id="lease-nfts">
        <h2>Lease Your NFTs</h2>
        <p>Lease your NFTs to other users and earn passive income.</p>

        <div className="nft-cards-container">
          <div className="nft-cards-scroll">
            {leasedNFTs.length > 0 ? (
              leasedNFTs.map((nft) => (
                <div key={nft.id} className="lease-nft-card">
                  <img src={nft.image} alt={nft.name} />
                  <div className="card-details">
                    <h3>{nft.name}</h3>
                    <p>Price: {nft.leasePrice} SOL/day</p>
                    <p>Duration: {nft.leaseDays} day(s)</p>
                    <button onClick={() => openLeaseModal(nft)}>Lease</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No NFTs available for lease.</p>
            )}
          </div>
        </div>
      </section>

      {showLeaseModal && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && closeLeaseModal()}
        >
          <div className="modal-content">
            <span className="close-btn" onClick={closeLeaseModal}>
              &times;
            </span>
            <h2>Lease {currentNFT?.name || "Default NFT"}</h2>
            <p>Price: {leasePrice} SOL/day</p>
            <p>Duration: {leaseDays} days</p>
            <button onClick={handleLease}>Confirm Lease</button>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2024 EcoNFT Energy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LeaseNFT;