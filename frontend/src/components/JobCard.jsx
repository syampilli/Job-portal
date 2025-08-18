import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const JobCard = ({ job }) => {
  const { token, user } = useAuth();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const getScore = async () => {
      if (!token || !user?.bio || !job?.description) return;

      try {
        const res = await axios.post(
          "/ai/match-score",
          {
            profileText: `${user.bio} ${user.skills?.join(" ")}`,
            jobDescription: job.description.trim(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const score = parseInt(res.data.score);
        if (!isNaN(score)) setScore(score);
      } catch (err) {
        console.error("AI score error:", err.message);
      }
    };

    getScore();
  }, [user, job]);

  return (
    <div className="bg-gray-800 p-4 rounded shadow relative">
      <h3 className="text-xl font-semibold text-cyan-300">{job.title}</h3>
      <p className="text-gray-300 mt-1">{job.description}</p>
      <div className="text-sm mt-2 text-gray-400">
        <p>🛠 Skills: {job.skills.join(", ")}</p>
        <p>📍 Location: {job.location}</p>
        <p>💰 Budget: ₹{job.budget}</p>
        <p>👤 Posted by: {job.postedBy?.name || "Anonymous"}</p>
      </div>

      {score !== null && (
        <div className="absolute top-2 right-2 bg-indigo-600 px-3 py-1 rounded text-sm font-semibold">
          Match: {score}%
        </div>
      )}
    </div>
  );
};

export default JobCard;
