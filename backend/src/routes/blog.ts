import { Router } from 'express';
import * as postController from '../controllers/postController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// Public blog routes
router.get('/', optionalAuthenticateToken, postController.getPublishedPosts);
router.get('/:slug', optionalAuthenticateToken, postController.getPublishedPost);

export default router;
