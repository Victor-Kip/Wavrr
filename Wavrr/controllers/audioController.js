import dotenv from "dotenv";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import { parseFile } from "music-metadata";
import path from "path";
import { fileURLToPath } from "url";
import { uploadBoth } from "../middleware/uploadMiddleware.js";
import Artist from "../models/artist.js";
import Post from "../models/post.js";
import Song from "../models/song.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const getArtistUuidFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded.actorUuid;
  } catch (err) {
    return null;
  }
};

export const postAudio = async (req, res) => {
  console.log("Upload request received");
  console.log("Files:", req.files);
  console.log("Body:", req.body);

  // Handle the file upload
  uploadBoth(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }

    try {
      const { songName, genre } = req.body;
      const files = req.files;

      // Debug: Log files structure
      console.log("Files object:", JSON.stringify(files, null, 2));

      // Validate required fields
      if (!songName || !songName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Song name is required",
        });
      }

      if (!genre || !genre.trim()) {
        return res.status(400).json({
          success: false,
          message: "Genre is required",
        });
      }

      if (!files || !files.audio || files.audio.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Audio file is required",
        });
      }

      // Get the uploaded files
      const audioFile = files.audio[0];

      // Check for cover image - handle both possible structures
      let coverFile = null;
      if (files.coverImage && files.coverImage.length > 0) {
        coverFile = files.coverImage[0];
      } else if (files["coverImage[]"] && files["coverImage[]"].length > 0) {
        coverFile = files["coverImage[]"][0];
      }

      // Create relative URLs for the files
      const audioUrl = `/uploads/audio/${path.basename(audioFile.filename)}`;
      const coverUrl = coverFile
        ? `/uploads/covers/${path.basename(coverFile.filename)}`
        : null;

      // Calculate duration using music-metadata
      let duration = 0;
      try {
        const metadata = await parseFile(audioFile.path);
        duration = Math.floor(metadata.format.duration || 0);
      } catch (error) {
        console.log("Error parsing audio metadata:", error);
        duration = 0;
      }

      // Get artist ID from token if available
      const artistUuid = getArtistUuidFromToken(req);

      // CRITICAL: If artistId is still null, we cannot proceed because the DB requires it
      if (!artistUuid) {
        return res.status(401).json({
          success: false,
          message: "You must be logged in as an artist to upload music",
        });
      }

      // Create song record in database
      const newSong = await Song.create({
        name: songName.trim(),
        audio_url: audioUrl,
        cover_url: coverUrl,
        genre: genre.trim(),
        duration: duration,
        release_date: new Date(),
        artist_uuid: artistUuid,
      });

      // AUTO-POST: Create a post automatically when a new song is uploaded
      try {
        await Post.create({
          type: 'announcement',
          content: `New release! Check out my new song "${songName.trim()}" now available on Echora!`,
          media_url: coverUrl,
          author_uuid: artistUuid,
          authorType: 'artist'
        });
      } catch (postError) {
        console.error("Auto-post creation failed:", postError);
        // We don't fail the whole upload if the auto-post fails
      }

      return res.status(201).json({
        success: true,
        message: "Music uploaded successfully",
        data: {
          id: newSong.uuid,
          name: newSong.name,
          url: audioUrl,
          coverUrl: newSong.coverURL,
          genre: newSong.genre,
          duration: newSong.duration,
          releaseDate: newSong.releaseDate,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload music",
        error: error.message,
      });
    }
  });
};

// Get all songs
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({
      order: [["release_date", "DESC"]],
      include: [
        {
          model: Artist,
          as: "artist",
          attributes: ["username"],
        },
      ],
    });
    
    const formattedSongs = songs.map(song => {
      const s = song.get();
      return {
        ...s,
        audioURL: s.audio_url,
        coverURL: s.cover_url,
        releaseDate: s.release_date,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedSongs,
    });
  } catch (error) {
    console.error("Get songs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch songs",
      error: error.message,
    });
  }
};

// Get song by ID
export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findOne({ where: { uuid: id } });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    const s = song.get();
    const formattedSong = {
      ...s,
      audioURL: s.audio_url,
      coverURL: s.cover_url,
      releaseDate: s.release_date,
    };

    return res.status(200).json({
      success: true,
      data: formattedSong,
    });
  } catch (error) {
    console.error("Get song error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch song",
      error: error.message,
    });
  }
};

// Get songs by artist
export const getSongsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const songs = await Song.findAll({
      where: { artist_uuid: artistId },
      order: [["release_date", "DESC"]],
      include: [
        {
          model: Artist,
          as: "artist",
          attributes: ["uuid", "username"],
        },
      ],
    });

    const formattedSongs = songs.map(song => {
      const s = song.get();
      return {
        ...s,
        audioURL: s.audio_url,
        coverURL: s.cover_url,
        releaseDate: s.release_date,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedSongs,
    });
  } catch (error) {
    console.error("Get artist songs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist songs",
      error: error.message,
    });
  }
};

export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const artistId = getArtistUuidFromToken(req);

    if (!artistId) return res.status(401).json({ success: false, message: "Authentication required" });

    const song = await Song.findOne({ where: { uuid: id } });
    if (!song) return res.status(404).json({ success: false, message: "Song not found" });

    if (song.artist_uuid !== artistId) {
      return res.status(403).json({ success: false, message: "You do not have permission to update this song" });
    }

    const updates = req.body;
    delete updates.artist_id;
    delete updates.artist_uuid;

    await song.update(updates);

    return res.status(200).json({ success: true, message: "Song updated successfully", data: song });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update song", error: error.message });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const artistId = getArtistUuidFromToken(req);

    if (!artistId) return res.status(401).json({ success: false, message: "Authentication required" });

    const song = await Song.findOne({ where: { uuid: id } });
    if (!song) return res.status(404).json({ success: false, message: "Song not found" });

    if (song.artist_uuid !== artistId) {
      return res.status(403).json({ success: false, message: "You do not have permission to delete this song" });
    }

    try {
      if (song.audio_url) await fs.unlink(path.join(__dirname, '..', song.audio_url)).catch(() => {});
      if (song.cover_url) await fs.unlink(path.join(__dirname, '..', song.cover_url)).catch(() => {});
    } catch (e) {}

    await song.destroy();

    return res.status(200).json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete song", error: error.message });
  }
};
