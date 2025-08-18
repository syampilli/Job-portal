import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">RizeOS Job Portal</h1>
      <p className="text-gray-300 mb-6 text-center max-w-md">
        A decentralized job & networking platform for developers, by developers.
      </p>

      {!user ? (
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Register
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/profile")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
      )}
    </div>
  );
};

export default Home;
