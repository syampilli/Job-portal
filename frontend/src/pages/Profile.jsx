import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    linkedIn: "",
    skills: [],
    walletAddress: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
        setLoading(false);
      } catch (err) {
        alert("Failed to load profile");
        logout();
        navigate("/login");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input name="name" value={form.name} onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <input name="email" value={form.email} disabled className="p-2 rounded bg-gray-700 text-gray-400" />
        <textarea name="bio" value={form.bio} onChange={handleChange} className="p-2 rounded bg-gray-800" placeholder="Tell us about yourself" />
        <input name="linkedIn" value={form.linkedIn} onChange={handleChange} className="p-2 rounded bg-gray-800" placeholder="LinkedIn URL" />
        <input name="walletAddress" value={form.walletAddress} onChange={handleChange} className="p-2 rounded bg-gray-800" placeholder="Wallet Address" />
        <input name="skills" value={form.skills.join(", ")} onChange={(e) => setForm({ ...form, skills: e.target.value.split(",").map(s => s.trim()) })} className="p-2 rounded bg-gray-800" placeholder="Comma separated skills" />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default Profile;
