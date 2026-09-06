import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Artist from "../models/artist.js";
import Comment from "../models/comment.js";
import Like from "../models/like.js";
import Post from "../models/post.js";
import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const isAuthenticationError = (error) =>
  error?.name === "TokenExpiredError" || error?.name === "JsonWebTokenError";

const getActorIdentity = (decoded) => {
  const actorType = decoded.actorType || (decoded.artistId ? "artist" : "user");

  return {
    actorUuid: decoded.actorUuid,
    actorType,
  };
};

const findActor = async ({ actorUuid, actorType }) => {
  const Actor = actorType === "artist" ? Artist : User;
  return actorUuid ? Actor.findOne({ where: { uuid: actorUuid } }) : null;
};

const findPostByUuid = (postUuid) =>
  Post.findOne({ where: { uuid: postUuid } });

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { actorUuid, actorType } = getActorIdentity(decoded);

    if (!actorUuid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const actor = await findActor({ actorUuid, actorType });
    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Authenticated actor not found",
      });
    }

    const post = await findPostByUuid(id);
    // post found
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const existingLike = await Like.findOne({
      where: {
        actor_uuid: actor.uuid,
        actor_type: actorType,
        target_uuid: post.uuid,
        target_type: "POST",
      },
    });

    if (existingLike) {
      await existingLike.destroy();
      const updatedCount = Math.max(0, Number(post.like_count || 0) - 1);
      await post.update({ like_count: updatedCount });

      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        data: post,
      });
    }

    await Like.create({
      actor_uuid: actor.uuid,
      actor_type: actorType,
      target_uuid: post.uuid,
      target_type: "POST",
    });

    const newCount = Number(post.like_count || 0) + 1;
    await post.update({ like_count: newCount });

    return res.status(201).json({
      success: true,
      message: "Post liked successfully",
      data: post,
    });
  } catch (error) {
    if (isAuthenticationError(error)) {
      return res.status(401).json({
        success: false,
        message: error.name === "TokenExpiredError"
          ? "Token expired. Please log in again."
          : "Invalid authentication token",
      });
    }
    console.error("toggleLike error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await findPostByUuid(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comments = await Comment.findAll({
      where: { post_uuid: post.uuid },
      order: [["createdAt", "ASC"]],
    });

    const userCommentIds = comments
      .filter((comment) => (comment.actor_type || "user") === "user")
      .map((comment) => comment.actor_uuid)
      .filter(Boolean);
    const artistCommentIds = comments
      .filter((comment) => comment.actor_type === "artist")
      .map((comment) => comment.actor_uuid)
      .filter(Boolean);

    const [users, artists] = await Promise.all([
      userCommentIds.length
        ? User.findAll({
            where: { uuid: userCommentIds },
            attributes: ["uuid", "username", "email"],
          })
        : [],
      artistCommentIds.length
        ? Artist.findAll({
            where: { uuid: artistCommentIds },
            attributes: ["uuid", "username", "email", "genre", "bio"],
          })
        : [],
    ]);

    const userMap = Object.fromEntries(
      users.map((user) => [user.uuid, user.get({ plain: true })])
    );
    const artistMap = Object.fromEntries(
      artists.map((artist) => [artist.uuid, artist.get({ plain: true })])
    );

    const commentsWithActor = comments.map((comment) => {
      const plainComment = comment.get({ plain: true });
      const actorUuid = plainComment.actor_uuid;
      if (plainComment.actor_type === "artist") {
        plainComment.actor = artistMap[actorUuid]
          ? { ...artistMap[actorUuid], type: "artist" }
          : null;
        plainComment.user = null;
      } else {
        plainComment.user = userMap[actorUuid] || null;
        plainComment.actor = plainComment.user
          ? { ...plainComment.user, type: "user" }
          : null;
      }
      return plainComment;
    });

    return res.status(200).json({
      success: true,
      data: commentsWithActor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPostLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await findPostByUuid(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const likes = await Like.findAll({
      where: {
        target_uuid: post.uuid,
        target_type: "POST",
      },
      order: [["createdAt", "ASC"]],
    });

    const userLikeUuids = likes
      .filter((like) => (like.actor_type || "user") === "user")
      .map((like) => like.actor_uuid)
      .filter(Boolean);
    const artistLikeUuids = likes
      .filter((like) => like.actor_type === "artist")
      .map((like) => like.actor_uuid)
      .filter(Boolean);

    const [users, artists] = await Promise.all([
      userLikeUuids.length
        ? User.findAll({
        where: { uuid: userLikeUuids },
        attributes: ["uuid", "username", "email"],
          })
        : [],
      artistLikeUuids.length
        ? Artist.findAll({
        where: { uuid: artistLikeUuids },
        attributes: ["uuid", "username", "email", "genre", "bio"],
          })
        : [],
    ]);

    const userMap = Object.fromEntries(
      users.map((user) => [user.uuid, user.get({ plain: true })])
    );
    const artistMap = Object.fromEntries(
      artists.map((artist) => [artist.uuid, artist.get({ plain: true })])
    );

    const likesWithActor = likes.map((like) => {
      const plainLike = like.get({ plain: true });
      const actorUuid = plainLike.actor_uuid;
      if (plainLike.actor_type === "artist") {
        plainLike.actor = artistMap[actorUuid]
          ? { ...artistMap[actorUuid], type: "artist" }
          : null;
        plainLike.user = null;
      } else {
        plainLike.user = userMap[actorUuid] || null;
        plainLike.actor = plainLike.user
          ? { ...plainLike.user, type: "user" }
          : null;
      }
      return plainLike;
    });

    return res.status(200).json({
      success: true,
      data: likesWithActor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    // incoming request
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { actorUuid, actorType } = getActorIdentity(decoded);

    if (!actorUuid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await findPostByUuid(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const actor = await findActor({ actorUuid, actorType });
    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Authenticated actor not found",
      });
    }

    const comment = await Comment.create({
      post_uuid: post.uuid,
      actor_uuid: actor.uuid,
      actor_type: actorType,
      text: String(text).trim(),
    });

    const commentWithUser = comment.get({ plain: true });
    commentWithUser.actor = {
      uuid: actor.uuid,
      username: actor.username,
      email: actor.email,
      type: actorType,
    };

    const newCount = Number(post.comment_count || 0) + 1;
    await post.update({ comment_count: newCount });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: commentWithUser,
    });
  } catch (error) {
    if (isAuthenticationError(error)) {
      return res.status(401).json({
        success: false,
        message: error.name === "TokenExpiredError"
          ? "Token expired. Please log in again."
          : "Invalid authentication token",
      });
    }
    console.error("addComment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    jwt.verify(token, JWT_SECRET);

    const post = await findPostByUuid(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const newCount = Number(post.share_count || 0) + 1;
    await post.update({ share_count: newCount });

    return res.status(200).json({
      success: true,
      message: "Post shared successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { postId, optionIndex } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userUuid = decoded.actorUuid;
    const voterType = decoded.actorType || "user";
    if (!userUuid) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const optionIndexNum = Number(optionIndex);

    if (!postId || !Number.isInteger(optionIndexNum) || optionIndexNum < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post UUID or optionIndex" });
    }

    const post = await findPostByUuid(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    if (post.type !== "poll")
      return res
        .status(400)
        .json({ success: false, message: "This post is not a poll" });

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

    const { actorUuid, actorType } = getActorIdentity(decoded);

    if (!actorUuid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const actor = await findActor({ actorUuid, actorType });
    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Authenticated actor not found",
      });
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
      author_uuid: actor.uuid,
      authorType: actorType,
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
    const { actorUuid, actorType } = getActorIdentity(decoded);

    const post = await findPostByUuid(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.author_uuid !== actorUuid || post.authorType !== actorType) {
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
    const { actorUuid, actorType } = getActorIdentity(decoded);

    const post = await findPostByUuid(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.author_uuid !== actorUuid || post.authorType !== actorType) {
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
