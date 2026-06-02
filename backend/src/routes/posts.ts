import { Router } from 'express';
import { authenticateToken, requireAuth, optionalAuthenticateToken } from '../middleware/auth';
import * as postController from '../controllers/postController';

const router = Router();

// Auth required routes
router.post('/', authenticateToken, requireAuth, postController.createPost);
router.get('/', authenticateToken, requireAuth, postController.getMyPosts);
router.get('/:id', optionalAuthenticateToken, postController.getPost);
router.patch('/:id', authenticateToken, requireAuth, postController.updatePost);
router.patch('/:id/publish', authenticateToken, requireAuth, postController.publishPost);
router.patch('/:id/unpublish', authenticateToken, requireAuth, postController.unpublishPost);

// Version routes
router.get('/:id/versions', authenticateToken, requireAuth, postController.getVersions);
router.get('/:id/versions/:versionId', authenticateToken, requireAuth, postController.getVersion);

// Diff route
router.get('/:id/diff', authenticateToken, requireAuth, postController.getDiff);

// Restore route (bonus)
router.post('/:id/restore/:versionId', authenticateToken, requireAuth, postController.restoreVersion);

export default router;
