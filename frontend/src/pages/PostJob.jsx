import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import WalletConnect from "../components/WalletConnect";
import { ethers } from "ethers";

const ADMIN_WALLET = "0x8bbCBE8a18425F17b10F746c5bf5D1d840d0941c"; // Replace with your admin wallet

const PostJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendPayment = async () => {
    if (!window.ethereum) return alert("MetaMask not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = await signer.sendTransaction({
      to: ADMIN_WALLET,
      value: ethers.parseEther("0.001"),
    });

    return tx.hash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const txHash = await sendPayment();

      // verify payment before posting job
      await axios.post("/payments/verify", { txHash }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axios.post(
        "/jobs",
        {
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job posted successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>

      <WalletConnect onConnected={setWalletAddress} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="title" placeholder="Job Title" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <textarea name="description" placeholder="Job Description" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <input name="budget" placeholder="Budget in ₹" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <input name="location" placeholder="Location (Remote/Onsite)" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
