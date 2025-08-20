import { useState } from "react";

const JobCard = ({ job, onApply }) => {
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleApplyClick = () => {
    setShowApply(!showApply);
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
      <p className="text-sm mt-1">
        <strong>Skills:</strong> {job.skills.join(", ")}
      </p>
      <p className="text-sm mt-1">
        <strong>Budget:</strong> ${job.budget || "N/A"}
      </p>
      <p className="text-sm mt-1">
        <strong>Location:</strong> {job.location || "Remote"}
      </p>

      <button
        onClick={handleApplyClick}
        className="mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        {showApply ? "Cancel" : "Apply"}
      </button>

      {showApply && (
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
