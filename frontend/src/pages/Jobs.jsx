import { useAuth } from "../context/AuthContext";  
import axios from "../api/axios"; 
import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";

const Jobs = () => {
  const { token } = useAuth();   
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]); // ✅ track applied job IDs

  // ✅ Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
      setError("Failed to load jobs.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Apply handler
  const handleApply = async (jobId, coverLetter) => {
    if (!token) {
      alert("You must be logged in to apply.");
      return;
    }

    try {
      const res = await axios.post(
        `/jobs/${jobId}/apply`,
        { coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Applied successfully!");
      setAppliedJobs((prev) => [...prev, jobId]);

      // ✅ Fetch the updated job and replace in state
      const updatedJob = await axios.get(`/jobs/${jobId}`);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? updatedJob.data : job
        )
      );

    } catch (err) {
      console.error("Apply error:", err.response?.data || err.message);

      if (err.response?.data?.message?.includes("already applied")) {
        setAppliedJobs((prev) => [...prev, jobId]);
      }

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
            <JobCard
              key={job._id}
              job={job}
              onApply={handleApply}
              applied={appliedJobs.includes(job._id)}
              disabled={!token}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jobs;
