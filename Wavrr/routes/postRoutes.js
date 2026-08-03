import express from "express";
import { createPost, getFeed, updatePost, deletePost, votePoll, toggleLike, addComment, sharePost, getPostComments, getPostLikes } from "../controllers/postController.js";
import { followArtist, unfollowArtist } from "../controllers/followController.js";

const router = express.Router();

// POST /api/posts - Create a new post
router.post('/', createPost);

// PUT /api/posts/:id - Update a post
router.put('/:id', updatePost);

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', deletePost);

// GET /api/posts/feed - Get global post feed
router.get('/feed', getFeed);

// GET /api/posts/:id/comments - Get comments for a post
router.get('/:id/comments', getPostComments);

// GET /api/posts/:id/likes - Get likes for a post
router.get('/:id/likes', getPostLikes);

// POST /api/posts/:id/like - Like or unlike a post
router.post('/:id/like', toggleLike);

// POST /api/posts/:id/comment - Add a comment to a post
router.post('/:id/comment', addComment);

// POST /api/posts/:id/share - Share a post
router.post('/:id/share', sharePost);

// POST /api/posts/vote - Vote in a poll
router.post('/vote', votePoll);

// POST /api/artists/:artistId/follow - Follow an artist
router.post('/artists/:artistId/follow', followArtist);

// DELETE /api/artists/:artistId/follow - Unfollow an artist
router.delete('/artists/:artistId/follow', unfollowArtist);

export default router;
