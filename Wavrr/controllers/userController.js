import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Artist from "../models/artist.js";
import Song from "../models/song.js";
import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const getPublicProfile = async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = await User.findOne({ where: { uuid: identifier } }) ||
      await User.findOne({ where: { username: identifier } });
    const artist = await Artist.findOne({ where: { uuid: identifier } }) ||
      await Artist.findOne({ where: { username: identifier } });
    const profile = user || artist;

    if (profile) {
      const favoriteUuid = profile.favorite_song_uuid;
      const favoriteSong = favoriteUuid
        ? await Song.findOne({ where: { uuid: favoriteUuid } })
        : null;
      return res.status(200).json({ success: true, data: { ...profile.get(), favoriteSong } });
    }

    return res.status(404).json({ success: false, message: "Profile not found" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const actorUuid = decoded.actorUuid;
    const actorType = decoded.actorType || "user";

    if (actorType === "artist") {
      const art = await Artist.findOne({ where: { uuid: actorUuid } });
      if (!art) return res.status(404).json({ success: false, message: "Artist not found" });
      
      let favoriteSong = null;
      if (art.favorite_song_uuid) {
        favoriteSong = await Song.findOne({ where: { uuid: art.favorite_song_uuid } });
      }

      return res.status(200).json({ 
        success: true, 
        data: { ...art.get(), favoriteSong } 
      });
    } else {
      const user = await User.findOne({ where: { uuid: actorUuid } });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      
      let favoriteSong = null;
      if (user.favorite_song_uuid) {
        favoriteSong = await Song.findOne({ where: { uuid: user.favorite_song_uuid } });
      }

      return res.status(200).json({ 
        success: true, 
        data: { ...user.get(), favoriteSong } 
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateFavoriteSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.actorType === "artist") {
      const artist = await Artist.findOne({ where: { uuid: decoded.actorUuid } });
      if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });
      await artist.update({ favorite_song_uuid: songId });
      return res.status(200).json({ success: true, message: "Favorite song updated", data: artist });
    } else {
      const user = await User.findOne({ where: { uuid: decoded.actorUuid } });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      await user.update({ favorite_song_uuid: songId });
      return res.status(200).json({ success: true, message: "Favorite song updated", data: user });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, genre, favoriteSongId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.actorType === "artist") {
      const artist = await Artist.findOne({ where: { uuid: decoded.actorUuid } });
      if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });

      await artist.update({
        username: username || artist.username,
        bio: bio || artist.bio,
        genre: genre || artist.genre,
        favorite_song_uuid: favoriteSongId || artist.favorite_song_uuid
      });

      return res.status(200).json({ success: true, message: "Artist profile updated", data: artist });
    } else {
      const user = await User.findOne({ where: { uuid: decoded.actorUuid } });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      await user.update({
        username: username || user.username,
        favorite_song_uuid: favoriteSongId || user.favorite_song_uuid
      });

      return res.status(200).json({ success: true, message: "User profile updated", data: user });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
