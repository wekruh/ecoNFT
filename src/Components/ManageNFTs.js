import React, { useState } from "react";
import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { useNavigate } from "react-router-dom";
import "../App.css";

const ManageNFTs = () => {
  const [showSellModal, setShowSellModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [sellPrice, setSellPrice] = useState("");
  const [leasePrice, setLeasePrice] = useState("");
  const [leaseDays, setLeaseDays] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userBalance, setUserBalance] = useState(null);
  const [leasedNFTs, setLeasedNFTs] = useState([]);

  const navigate = useNavigate();

  const isPhantomInstalled = () => window?.solana?.isPhantom;

  const handleNewLease = (nftName, leasePrice, leaseDays) => {
    setLeasedNFTs((prevLeasedNFTs) => [
      ...prevLeasedNFTs,
      { name: nftName, leasePrice, leaseDays },
    ]);
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
      await updateBalance(address);
      alert(`Wallet connected: ${address.toString()}`);
    } catch (err) {
      console.error("Error connecting to Phantom Wallet:", err);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setUserBalance(null);
    alert("Wallet disconnected!");
  };

  const updateBalance = async (address) => {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const balance = await connection.getBalance(address);
    setUserBalance(balance / 1e9);
  };

  const ownedNFTs = [
    { id: 1, name: "Solar Panel NFT", image: "/images/solar-panel.png" },
    { id: 2, name: "Wind Turbine NFT", image: "/images/wind-turbine.png" },
  ];

  const openSellModal = (nft) => {
    setCurrentNFT(nft);
    setShowSellModal(true);
  };

  const openLeaseModal = (nft) => {
    setCurrentNFT(nft);
    setShowLeaseModal(true);
  };

  const closeSellModal = () => setShowSellModal(false);
  const closeLeaseModal = () => setShowLeaseModal(false);

  const handleSell = async () => {
  if (!walletConnected) {
    alert("Please connect your wallet before proceeding with the transaction.");
    return;
  }

  try {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const payerPublicKey = new PublicKey(walletAddress); // Taker (kullanıcı) hesabı, parayı verecek
    const recipientAddress = new PublicKey('6CV1KuzTuH7AGzdqqbqrBjfkzriSsLBEQQF93GGHX619'); // Giver (satıcı) hesabı, parayı alacak
    const { blockhash } = await connection.getLatestBlockhash();
    const lamports = parseFloat(sellPrice) * 1e9; // SOL'u lamports'a çeviriyoruz (1 SOL = 1e9 lamports)

    // Kullanıcının bakiyesi kontrol ediliyor
    const balance = await connection.getBalance(payerPublicKey);
    if (balance < lamports) {
      alert("Insufficient balance.");
      return;
    }

    // Yeni Transaction nesnesi oluşturuluyor
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payerPublicKey;

    // Transfer işlemi ekleniyor
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: payerPublicKey, // Taker, parayı veren
      toPubkey: recipientAddress, // Giver, parayı alan
      lamports, // Gönderilecek miktar
    });

    transaction.add(transferInstruction); // Transfer işlemini transaksiyona ekliyoruz

    // İşlem imzalanıyor
    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    const confirmation = await connection.confirmTransaction(signature, "confirmed");

    if (confirmation.value.err) {
      alert("Transaction failed.");
    } else {
      alert(`Sold ${currentNFT.name} for ${sellPrice} SOL!`);
      await updateBalance(payerPublicKey); // Kullanıcı bakiyesi güncelleniyor
      closeSellModal(); // Modal kapatılıyor
    }
  } catch (err) {
    console.error("Sell transaction error:", err);
  }
};

const handleLease = () => {
  // Kiralama işlemi sonrası leasedNFTs dizisini güncelle
  handleNewLease(currentNFT.name, leasePrice, leaseDays);

  // Kiralama işlemini başarılı bir şekilde yapınca, kullanıcıyı lease ekranına yönlendir
  navigate("/lease-nft", {
    state: {
      walletAddress,
      userBalance,
      leasePrice,
      leaseDays,
      nftName: currentNFT.name, // NFT türü
    },
  });

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
            <li><a href="/lease-nft">Lease NFTs</a></li>
          </ul>
        </nav>
        <button id="connect-wallet" onClick={walletConnected ? disconnectWallet : connectWallet}>
          {walletConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </header>

      <section id="owned-nfts">
        <h2>Your Owned NFTs</h2>
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

      {/* Leased NFTs */}
      <section id="leased-nfts">
        <h2>Your Leased NFTs</h2>
        <div className="nft-cards">
  {ownedNFTs.map((nft) => (
    <div key={nft.id} className="nft-card">
      <img src={nft.image} alt={nft.name} />
      <h3>{nft.name}</h3>
      <div className="button-group">
        <button onClick={() => openSellModal(nft)}>Sell</button>
        <button onClick={() => openLeaseModal(nft)}>Lease</button>
      </div>
    </div>
  ))}
</div>
      </section>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeSellModal}>&times;</span>
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
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeLeaseModal}>&times;</span>
            <h2>Lease {currentNFT.name}</h2>
            <input
              type="number"
              placeholder="Daily rent price (SOL)"
              value={leasePrice}
              onChange={(e) => setLeasePrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Lease duration (days)"
              value={leaseDays}
              onChange={(e) => setLeaseDays(e.target.value)}
            />
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

export default ManageNFTs;