import { useAuth } from "../context/AuthContext";  
import axios from "../api/axios"; 
import { useState, useEffect } from "react";

const Jobs = () => {
  const { token } = useAuth();   
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Fetch jobs (even if user is not logged in)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/jobs"); // ✅ correct endpoint
        setJobs(res.data.jobs || []); // ✅ get the array
      } catch (err) {
        console.error("Error fetching jobs:", err.response?.data || err.message);
        setError("Failed to load jobs.");
      }
    };

    fetchJobs();
  }, []);

  // ✅ Apply handler
  const handleApply = async (jobId) => {
    if (!token) {
      alert("You must be logged in to apply.");
      return;
    }

    try {
      const res = await axios.post(
        `/jobs/${jobId}/apply`,   // ✅ correct endpoint
        { coverLetter: "This is my cover letter." }, // send data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Applied successfully!");
    } catch (err) {
      console.error("Apply error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">🧑‍💻 Available Jobs</h2>

      {error && <p className="text-red-500">{error}</p>}

      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li
              key={job._id}
              className="border border-gray-700 p-4 rounded-lg mb-3 bg-gray-800"
            >
              <h3 className="font-semibold text-cyan-300">{job.title}</h3>
              <p className="text-gray-300">{job.description}</p>
              <p className="text-sm text-gray-400">📍 {job.location}</p>
              <p className="text-sm text-gray-400">💰 ₹{job.budget}</p>

              <button
                onClick={() => handleApply(job._id)}
                disabled={!token}
                className={`mt-3 px-4 py-2 rounded ${
                  token
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                {token ? "Apply" : "Login to Apply"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jobs;
