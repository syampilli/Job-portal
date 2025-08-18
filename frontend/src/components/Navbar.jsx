import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between px-6 py-3 shadow-md">
      <Link to="/" className="text-xl font-bold text-cyan-400">RizeOS</Link>

      <div className="flex gap-4 items-center">
        <Link to="/jobs" className="hover:text-cyan-300">Jobs</Link>
        {user && <Link to="/post-job" className="hover:text-cyan-300">Post Job</Link>}
        {user && <Link to="/profile" className="hover:text-cyan-300">Profile</Link>}
        {!user ? (
          <>
            <Link to="/login" className="hover:text-cyan-300">Login</Link>
            <Link to="/register" className="hover:text-cyan-300">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
