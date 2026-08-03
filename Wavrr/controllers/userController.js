import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Artist from "../models/artist.js";
import Song from "../models/song.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const getPublicProfile = async (req, res) => {
  try {
    const { identifier } = req.params;
    const lookupId = Number(identifier);

    if (Number.isInteger(lookupId) && lookupId > 0) {
      const user = await User.findByPk(lookupId);
      if (user) {
        let favoriteSong = null;
        if (user.favorite_song_id) {
          favoriteSong = await Song.findByPk(user.favorite_song_id);
        }

        return res.status(200).json({
          success: true,
          data: { ...user.get(), favoriteSong },
        });
      }

      const artist = await Artist.findByPk(lookupId);
      if (artist) {
        let favoriteSong = null;
        if (artist.favoriteSongId) {
          favoriteSong = await Song.findByPk(artist.favoriteSongId);
        }

        return res.status(200).json({
          success: true,
          data: { ...artist.get(), favoriteSong },
        });
      }
    }

    const userByUsername = await User.findOne({
      where: { username: identifier },
    });
    if (userByUsername) {
      let favoriteSong = null;
      if (userByUsername.favorite_song_id) {
        favoriteSong = await Song.findByPk(userByUsername.favorite_song_id);
      }

      return res.status(200).json({
        success: true,
        data: { ...userByUsername.get(), favoriteSong },
      });
    }

    const artistByUsername = await Artist.findOne({
      where: { username: identifier },
    });
    if (artistByUsername) {
      let favoriteSong = null;
      if (artistByUsername.favoriteSongId) {
        favoriteSong = await Song.findByPk(artistByUsername.favoriteSongId);
      }

      return res.status(200).json({
        success: true,
        data: { ...artistByUsername.get(), favoriteSong },
      });
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
    const userId = decoded.userId || decoded.id;
    const artistId = decoded.artistId;

    if (artistId) {
      const art = await Artist.findByPk(artistId);
      if (!art) return res.status(404).json({ success: false, message: "Artist not found" });
      
      let favoriteSong = null;
      if (art.favoriteSongId) {
        favoriteSong = await Song.findByPk(art.favoriteSongId);
      }

      return res.status(200).json({ 
        success: true, 
        data: { ...art.get(), favoriteSong } 
      });
    } else {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      
      let favoriteSong = null;
      if (user.favorite_song_id) {
        favoriteSong = await Song.findByPk(user.favorite_song_id);
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
    
    if (decoded.artistId) {
      const artist = await Artist.findByPk(decoded.artistId);
      if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });
      await artist.update({ favoriteSongId: songId });
      return res.status(200).json({ success: true, message: "Favorite song updated", data: artist });
    } else {
      const userId = decoded.userId || decoded.id;
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      await user.update({ favorite_song_id: songId });
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
    
    if (decoded.artistId) {
      const artist = await Artist.findByPk(decoded.artistId);
      if (!artist) return res.status(404).json({ success: false, message: "Artist not found" });

      await artist.update({
        username: username || artist.username,
        bio: bio || artist.bio,
        genre: genre || artist.genre,
        favoriteSongId: favoriteSongId || artist.favoriteSongId
      });

      return res.status(200).json({ success: true, message: "Artist profile updated", data: artist });
    } else {
      const userId = decoded.userId || decoded.id;
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      await user.update({
        username: username || user.username,
        favoriteSongId: favoriteSongId || user.favoriteSongId
      });

      return res.status(200).json({ success: true, message: "User profile updated", data: user });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
