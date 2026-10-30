import { Router } from 'express';
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  votePost,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/auth.js';
import commentRoutes from './commentRoutes.js';

const router = Router();

router.get('/', listPosts);
router.get('/:postId', getPost);
router.post('/', requireAuth, createPost);
router.put('/:postId', requireAuth, updatePost);
router.delete('/:postId', requireAuth, deletePost);
router.post('/:postId/vote', requireAuth, votePost);

// Comments are nested under a post: /posts/:postId/comments
router.use('/:postId/comments', commentRoutes);

export default router;
