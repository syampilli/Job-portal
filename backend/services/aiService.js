import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/** Extract skills from user bio or resume */
export const extractSkillsFromBio = async (bioText) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
  Extract the top 5–7 relevant skills from this user's profile or resume text.
  Format the response as a JSON array.
  ---
  ${bioText}
  ---
  Example output:
  ["React", "Node.js", "MongoDB", "Teamwork", "Leadership"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return JSON.parse(response);
  } catch (err) {
    console.error('Skill extraction failed:', err.message);
    return [];
  }
};

/** Get a match score between user profile and job description */
export const calculateMatchScore = async (profileText, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
  User Profile:
  ${profileText}

  Job Description:
  ${jobDescription}

  On a scale of 0 to 100, how well does this profile match the job?
  Only return a single number.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    const score = parseInt(response.match(/\d+/)?.[0] || '0');
    return score;
  } catch (err) {
    console.error('Match scoring failed:', err.message);
    return 0;
  }
};
