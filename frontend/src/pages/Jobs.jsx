import { useEffect, useState } from "react";
import axios from "../api/axios";
import JobCard from "../components/JobCard";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs");
      setJobs(res.data.jobs || res.data); // adjust based on your backend response
    } catch (err) {
      console.error("Error loading jobs:", err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">🧑‍💻 Job Feed</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
