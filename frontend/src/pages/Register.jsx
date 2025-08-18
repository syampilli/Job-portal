import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', form);
      login(res.data, res.data.token); // update context
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Name" onChange={handleChange} className="p-2 border" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-2 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border" />
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default Register;
