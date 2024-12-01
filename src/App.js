import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import MintPage from "./Components/MintPage";
import ManageNFTs from "./Components/ManageNFTs";
import LearnMore from "./Components/LearnMore";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mint-nfts" element={<MintPage />} />
        <Route path="/manage-nfts" element={<ManageNFTs />} />
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
    </Router>
  );
}

export default App;
