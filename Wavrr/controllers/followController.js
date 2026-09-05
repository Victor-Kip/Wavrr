import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Artist from "../models/artist.js";
import Follow from "../models/follow.js";
import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const followArtist = async (req, res) => {
  try {
    const { artistId: artistUuid } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const followerUuid = decoded.actorUuid;

    if (!followerUuid || !artistUuid) return res.status(401).json({ success: false, message: "Invalid token" });

    const artist = await Artist.findOne({ where: { uuid: artistUuid } });
    const follower = await User.findOne({ where: { uuid: followerUuid } });
    if (!artist || !follower) return res.status(401).json({ success: false, message: "Actor not found" });

    // Check if already following
    const existingFollow = await Follow.findOne({
      where: { follower_uuid: follower.uuid, following_uuid: artist.uuid }
    });

    if (existingFollow) {
      return res.status(400).json({ success: false, message: "You are already following this artist" });
    }

    await Follow.create({
      follower_uuid: follower.uuid,
      following_uuid: artist.uuid,
      following_type: 'artist'
    });

    return res.status(201).json({ success: true, message: "Successfully followed artist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const unfollowArtist = async (req, res) => {
  try {
    const { artistId: artistUuid } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const followerUuid = decoded.actorUuid;

    const follow = await Follow.findOne({
      where: { follower_uuid: followerUuid, following_uuid: artistUuid }
    });

    if (!follow) return res.status(404).json({ success: false, message: "Follow relationship not found" });

    await follow.destroy();
    return res.status(200).json({ success: true, message: "Successfully unfollowed artist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
