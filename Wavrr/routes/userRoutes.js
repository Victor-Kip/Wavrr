import express from "express";
import { updateProfile, getProfile, getPublicProfile, updateFavoriteSong } from "../controllers/userController.js";

const router = express.Router();

// GET /api/users/profile - Get current user profile
router.get('/profile', getProfile);

// GET /api/users/:identifier - Get a public profile by username or numeric id
router.get('/:identifier', getPublicProfile);

// PUT /api/users/profile - Update profile information
router.put('/profile', updateProfile);

// PUT /api/users/favorite-song - Update favorite song
router.put('/favorite-song', updateFavoriteSong);

export default router;
