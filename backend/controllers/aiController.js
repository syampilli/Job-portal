import { extractSkillsFromBio, calculateMatchScore } from '../services/aiService.js';

export const getMatchScore = async (req, res) => {
  const { profileText, jobDescription } = req.body;
  try {
    const score = await calculateMatchScore(profileText, jobDescription);
    res.json({ score });
  } catch (err) {
    res.status(500).json({ message: 'AI failed', error: err.message });
  }
};
