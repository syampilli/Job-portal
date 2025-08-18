import { useState } from "react";

const WalletConnect = ({ onConnected }) => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not detected");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      setWalletAddress(account);
      onConnected(account);
    } catch (err) {
      console.error("Wallet connection error:", err.message);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={connectWallet}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
      >
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default WalletConnect;
