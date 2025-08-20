import Job from "../models/job.js";
import { calculateMatchScore } from "../services/aiService.js";

// POST /api/jobs
export const createJob = async (req, res) => {
  const { title, description, skills, budget, location } = req.body;

  if (!title || !description || !skills) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const job = new Job({
      title,
      description,
      skills,
      budget,
      location,
      postedBy: req.user._id,
    });

    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Job creation failed", error: err.message });
  }
};

// GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { skill, location, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (skill) filter.skills = { $in: [skill] };
    if (location) filter.location = new RegExp(location, "i");

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
      jobs,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: err.message });
  }
};

// GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name");
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
};

export const getAllJobsWithScore = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.bio) {
      return res
        .status(400)
        .json({ message: "User bio is required for scoring" });
    }

    const profileText = `${user.bio} ${user.skills?.join(" ") || ""}`;
    const jobs = await Job.find().populate("postedBy", "name");

    const jobsWithScores = await Promise.all(
      jobs.map(async (job) => {
        const jobDescription = job.description?.trim() || "";
        const score = await calculateMatchScore(profileText, jobDescription);
        return { ...job.toObject(), matchScore: score };
      })
    );

    res.json(jobsWithScores);
  } catch (err) {
    console.error("AI score backend error:", err.message);
    res.status(500).json({
      message: "Failed to fetch jobs with match score",
      error: err.message,
    });
  }
};

export const getjobapplications = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log("Fetching applications for job ID:", jobId);
    const job = await Job.findById(jobId).populate(
      "applications.user",
      "name email"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    // console.log("Job found:", job);
    res.json(job.applications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching job applications", error: err.message });
    console.error("Error fetching job applications:", err.message);
  }
};

export const applyToJob = async (req, res) => {
  const jobId = req.params.id;
  const { coverLetter } = req.body;

  if (!coverLetter) {
    return res.status(400).json({ message: "Cover letter is required" });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Ensure applications array exists (important for older documents)
    if (!job.applications) {
      job.applications = [];
    }

    const userId = req.user._id;
    if (
      job.applications.some(
        (app) => app.user.toString() === userId.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    job.applications.push({
      user: userId,
      coverLetter,
    });

    await job.save();
    res.status(200).json({ message: "Application submitted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error applying to job", error: err.message });
  }
};
