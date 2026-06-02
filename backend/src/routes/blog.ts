import { Router } from 'express';
import * as postController from '../controllers/postController';

const router = Router();

// Public blog routes
router.get('/', postController.getPublishedPosts);
router.get('/:slug', postController.getPublishedPost);

export default router;
