const { z } = require('zod');
const db = require('../../database/db');

const profileUpdateSchema = z.object({
  district: z.string().min(1, 'District is required'),
  block: z.string().optional(),
  age: z.number().int().min(1).max(120),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'ALL']),
  socialCategory: z.enum(['GENERAL', 'OBC', 'EBC', 'SC', 'ST', 'EWS', 'ALL']).optional(),
  isBiharResident: z.boolean().default(true),
  education: z.enum(['BELOW_10TH', '10TH_PASS', '12TH_PASS', 'DIPLOMA', 'GRADUATE', 'POST_GRADUATE', 'DOCTORATE', 'VOCATIONAL']),
  occupation: z.string().optional(),
  annualIncome: z.number().min(0),
  landHoldingAcres: z.number().min(0).optional().default(0),
  isDifferentlyAbled: z.boolean().optional().default(false),
  skills: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([])
});

async function getProfile(req, res, next) {
  try {
    const profile = db.getProfileByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create one.'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const data = profileUpdateSchema.parse(req.body);
    const updated = db.saveProfile(req.user.id, data);

    res.json({
      success: true,
      message: 'Citizen profile updated successfully',
      profile: updated
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
