import { Router } from 'express';
import * as postController from '../controllers/postController';

const router = Router();

router.get('/', postController.search);

export default router;
