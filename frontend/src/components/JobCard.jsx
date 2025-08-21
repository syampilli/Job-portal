import { useState } from "react";

const JobCard = ({ job, onApply, applied, disabled }) => {
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleApplyClick = () => {
    if (!applied) {
      setShowApply(!showApply);
    }
  };

  const handleSubmit = () => {
    if (coverLetter.trim()) {
      onApply(job._id, coverLetter);
      setShowApply(false);
      setCoverLetter("");
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-xl shadow-lg mb-4">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="text-sm">{job.description}</p>
      <p className="text-sm mt-1"><strong>Skills:</strong> {job.skills.join(", ")}</p>
      <p className="text-sm mt-1"><strong>Budget:</strong> ${job.budget || "N/A"}</p>
      <p className="text-sm mt-1"><strong>Location:</strong> {job.location || "Remote"}</p>

      {/* Apply Button */}
      <button
        onClick={handleApplyClick}
        disabled={applied || disabled}
        className={`mt-3 px-4 py-2 rounded-lg ${
          applied
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {applied ? "Already Applied" : "Apply"}
      </button>

      {/* Applications Count Button */}
      <button
        disabled
        className="mt-3 ml-3 px-4 py-2 bg-purple-600 rounded-lg cursor-default"
      >
        👥 {job.applications?.length || 0} Applied
      </button>

      {/* Cover Letter Form */}
      {showApply && !applied && (
        <div className="mt-3">
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter..."
            className="w-full p-2 rounded-lg text-black"
          />
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
          >
            Submit Application
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
