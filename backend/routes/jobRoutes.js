import express from 'express';
import { createJob, getJobs, getJobById, applyToJob, getjobapplications } from '../controllers/jobController.js';
import protect from '../middleware/authMiddleware.js';
import { getAllJobsWithScore } from "../controllers/jobController.js";
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.get("/with-score", authMiddleware, getAllJobsWithScore);
router.get('/:id/applications', authMiddleware, getjobapplications);
router.post('/:id/apply', authMiddleware, applyToJob);

export default router;
