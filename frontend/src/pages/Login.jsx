import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      login(res.data, res.data.token);
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-2 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border" />
        <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Login</button>
      </form>
    </div>
  );
};

export default Login;
