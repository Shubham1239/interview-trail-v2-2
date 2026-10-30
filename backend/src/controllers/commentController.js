import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listComments = asyncHandler(async function listComments(req, res) {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: 1 })
    .populate('author', 'name');
  res.json(
    comments.map(function toJson(c) {
      return c.toJSON();
    })
  );
});

export const createComment = asyncHandler(async function createComment(req, res) {
  const { body } = req.body;
  if (!body || !body.trim()) throw new ApiError(400, 'Comment cannot be empty');

  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');

  const comment = await Comment.create({ post: post.id, author: req.user.id, body: body.trim() });
  post.commentCount += 1;
  await post.save();
  await comment.populate('author', 'name');
  res.status(201).json(comment.toJSON());
});

export const deleteComment = asyncHandler(async function deleteComment(req, res) {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (comment.author.toString() !== req.user.id.toString() && req.user.role === 'user') {
    throw new ApiError(403, 'You can only delete your own comments');
  }

  await comment.deleteOne();
  await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
  res.json({ ok: true });
});
