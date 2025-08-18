import User from '../models/User.js';

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
  res.json(req.user);
  console.log(req.user);
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  const { name, bio, linkedIn, skills, walletAddress } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.linkedIn = linkedIn || user.linkedIn;
    user.skills = skills || user.skills;
    user.walletAddress = walletAddress || user.walletAddress;

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};
