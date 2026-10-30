import { Router } from 'express';
import { listComments, createComment, deleteComment } from '../controllers/commentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/', listComments);
router.post('/', requireAuth, createComment);
router.delete('/:commentId', requireAuth, deleteComment);

export default router;
