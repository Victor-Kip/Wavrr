import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Artist from "../models/artist.js";
import Post from "../models/post.js";
import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const votePoll = async (req, res) => {
  try {
    const { postId, optionIndex } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded.artistId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const postIdNum = Number(postId);
    const optionIndexNum = Number(optionIndex);

    if (!Number.isInteger(postIdNum) || postIdNum <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId" });
    }

    const post = await Post.findByPk(postIdNum);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    if (post.type !== "poll")
      return res
        .status(400)
        .json({ success: false, message: "This post is not a poll" });

    let pollOptions = post.poll_options;
    if (!pollOptions) {
      return res.status(400).json({
        success: false,
        message: "Poll options missing for this post",
      });
    }
    if (typeof pollOptions === "string") {
      try {
        pollOptions = JSON.parse(pollOptions);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid poll options format",
        });
      }
    }
    const options = Array.isArray(pollOptions.options)
      ? pollOptions.options
      : [];
    const votes = Array.isArray(pollOptions.votes)
      ? [...pollOptions.votes]
      : options.map(() => 0);

    if (
      !Number.isInteger(optionIndexNum) ||
      optionIndexNum < 0 ||
      optionIndexNum >= options.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid option index",
      });
    }
    votes[optionIndexNum] = (Number(votes[optionIndexNum]) || 0) + 1;
    post.set("poll_options", {
      ...pollOptions,
      options,
      votes,
    });
    await post.save();
    await post.reload();

    return res
      .status(200)
      .json({ success: true, message: "Vote cast successfully", data: post });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { post_type, content, mediaUrl, poll_options } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Determine author identity
    // The token might have userId (from userLogin) or artistId (from artistLogin)
    let authorId = decoded.userId || decoded.id || decoded.artistId;
    let authorType = decoded.artistId ? "artist" : "user";

    if (!authorId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    if (!content && !poll_options) {
      return res.status(400).json({
        success: false,
        message: "Content or poll options are required",
      });
    }

    // Determine post type: if pollOptions exist, type should be 'poll'
    let postType = post_type || "text";
    if (poll_options && !post_type) {
      postType = "poll";
    }

    const post = await Post.create({
      type: postType,
      content: content || "",
      media_url: mediaUrl || null,
      poll_options: poll_options || null,
      authorId,
      authorType,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getFeed = async (req, res) => {
  try {
    // Simple feed: get all posts ordered by creation date
    // In a real app, we'd filter by followed users
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "userAuthor", attributes: ["username", "email"] },
        {
          model: Artist,
          as: "artistAuthor",
          attributes: ["username", "genre", "bio"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get feed error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, pollOptions } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const authorId = decoded.userId || decoded.id || decoded.artistId;

    const post = await Post.findByPk(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.authorId !== authorId) {
      return res.status(403).json({
        success: false,
        message: "You are not the author of this post",
      });
    }

    await post.update({
      content: content || post.content,
      poll_options: pollOptions
        ? JSON.stringify(pollOptions)
        : post.poll_options,
    });

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const authorId = decoded.userId || decoded.id || decoded.artistId;

    const post = await Post.findByPk(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.authorId !== authorId) {
      return res.status(403).json({
        success: false,
        message: "You are not the author of this post",
      });
    }

    await post.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
