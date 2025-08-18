import express from 'express';
import { createJob, getJobs, getJobById } from '../controllers/jobController.js';
import protect from '../middleware/authMiddleware.js';
import { getAllJobsWithScore } from "../controllers/jobController.js";
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.get("/with-score", authMiddleware, getAllJobsWithScore);

export default router;
