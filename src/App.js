import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import MintPage from "./Components/MintPage";
import ManageNFTs from "./Components/ManageNFTs";
import LearnMore from "./Components/LearnMore";
import LeaseNFT from "./Components/LeaseNFT";

function App() {
  const [leasedNFTs, setLeasedNFTs] = useState([]);

  const handleNewLease = (nftName, leasePrice, leaseDays) => {
    setLeasedNFTs((prevLeasedNFTs) => [
      ...prevLeasedNFTs,
      { name: nftName, leasePrice, leaseDays },
    ]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mint-nfts" element={<MintPage />} />
        <Route path="/manage-nfts" element={<ManageNFTs leasedNFTs={leasedNFTs} />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/lease-nft" element={<LeaseNFT onLease={handleNewLease} />} />
      </Routes>
    </Router>
  );
}

export default App;