import { Router } from 'express';
import * as postController from '../controllers/postController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuthenticateToken, postController.search);

export default router;
