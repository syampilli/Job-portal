import express from 'express';
import { getMatchScore } from '../controllers/aiController.js';
const router = express.Router();

router.post('/match-score', getMatchScore);

export default router;
