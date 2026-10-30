import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listPosts = asyncHandler(async function listPosts(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
  const { q, tags, sortBy = 'recent', company } = req.query;

  const filter = {};
  if (q) filter.$text = { $search: q };
  if (company) filter.company = company;
  if (tags) {
    filter.tags = {
      $in: tags
        .split(',')
        .map(function normalizeTag(t) {
          return t.trim().toLowerCase();
        })
        .filter(Boolean),
    };
  }

  const sort = { createdAt: -1 }; // 'top' is re-sorted after scoring, below

  const [totalCount, docs] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('author', 'name'),
  ]);

  let items = docs.map(function toJson(d) {
    return d.toJSON();
  });
  if (sortBy === 'top') {
    items = items.sort(function byScoreDesc(a, b) {
      return b.score - a.score;
    });
  }

  res.json({ items, page, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)), totalCount });
});



// export const listPosts = asyncHandler(async function listPosts(req, res) {
//   const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
//   const { q, tags, company, cursor } = req.query;

//   const filter = {};
//   if (q) filter.$text = { $search: q };
//   if (company) filter.company = company;
//   if (tags) {
//     filter.tags = {
//       $in: tags
//         .split(',')
//         .map(function normalizeTag(t) {
//           return t.trim().toLowerCase();
//         })
//         .filter(Boolean),
//     };
//   }

//   if (cursor) {
//     if (!mongoose.Types.ObjectId.isValid(cursor)) throw new ApiError(400, 'Invalid cursor');
//     filter._id = { $lt: cursor };
//   }

//   const docs = await Post.find(filter)
//     .sort({ _id: -1 })
//     .limit(pageSize + 1)
//     .populate('author', 'name');

//   const hasMore = docs.length > pageSize;
//   const items = (hasMore ? docs.slice(0, pageSize) : docs).map(function toJson(d) {
//     return d.toJSON();
//   });

//   res.json({ items, nextCursor: hasMore ? items[items.length - 1].id : null });
// });

export const getPost = asyncHandler(async function getPost(req, res) {
  const post = await Post.findById(req.params.postId).populate('author', 'name');
  if (!post) throw new ApiError(404, 'Post not found');
  res.json(post.toJSON());
});

export const createPost = asyncHandler(async function createPost(req, res) {
  const { title, body, company, tags } = req.body;
  if (!title || !body) throw new ApiError(400, 'Title and body are required');

  const post = await Post.create({
    title,
    body,
    company,
    tags: Array.isArray(tags) ? tags : [],
    author: req.user.id,
  });
  await post.populate('author', 'name');
  res.status(201).json(post.toJSON());
});

export const updatePost = asyncHandler(async function updatePost(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.author.toString() !== req.user.id.toString() && req.user.role === 'user') {
    throw new ApiError(403, 'You can only edit your own posts');
  }

  const { title, body, company, tags } = req.body;
  if (title !== undefined) post.title = title;
  if (body !== undefined) post.body = body;
  if (company !== undefined) post.company = company;
  if (tags !== undefined) post.tags = tags;

  await post.save();
  await post.populate('author', 'name');
  res.json(post.toJSON());
});

export const deletePost = asyncHandler(async function deletePost(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');
  if (post.author.toString() !== req.user.id.toString() && req.user.role === 'user') {
    throw new ApiError(403, 'You can only delete your own posts');
  }
  await Promise.all([post.deleteOne(), Comment.deleteMany({ post: post.id })]);
  res.json({ ok: true });
});

export const votePost = asyncHandler(async function votePost(req, res) {
  const { direction } = req.body; // -1 | 0 | 1
  if (![-1, 0, 1].includes(direction)) throw new ApiError(400, 'direction must be -1, 0, or 1');

  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');

  post.votes = post.votes.filter(function notMine(v) {
    return v.user.toString() !== req.user.id.toString();
  });
  if (direction !== 0) post.votes.push({ user: req.user.id, direction });

  await post.save();
  await post.populate('author', 'name');
  res.json(post.toJSON());
});
