import { Request, Response, NextFunction } from 'express';
import { Post, PostVersion } from '../models';
import * as postService from '../services/postService';
import * as diffService from '../services/diffService';
import * as searchService from '../services/searchService';
import { AppError } from '../middleware/errorHandler';
import { isUUID } from '../utils/validation';
import type { TipTapDoc } from '../types';

interface CreatePostBody {
  title: string;
  content: TipTapDoc;
  excerpt?: string;
}

interface UpdatePostBody {
  title?: string;
  content?: TipTapDoc;
  excerpt?: string;
}

// Create post
export async function createPost(req: Request<{}, {}, CreatePostBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');

    const { title, content, excerpt } = req.body;

    if (!title || !content) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Title and content are required');
    }

    const result = await postService.createPost(title, content, excerpt || null, req.user.userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Get posts for authenticated user
export async function getMyPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');

    const posts = await postService.getPostsByAuthor(req.user.userId);
    res.json({ posts });
  } catch (err) {
    next(err);
  }
}

// Get single post
export async function getPost(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.getPost(req.params.id, req.user?.userId);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// Update post
export async function updatePost(req: Request<{ id: string }, {}, UpdatePostBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    if (!isUUID(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid post ID format');

    const result = await postService.updatePost(req.params.id, req.user.userId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Publish post
export async function publishPost(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    if (!isUUID(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid post ID format');

    const post = await postService.publishPost(req.params.id, req.user.userId);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// Unpublish post
export async function unpublishPost(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    if (!isUUID(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid post ID format');

    const post = await postService.unpublishPost(req.params.id, req.user.userId);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// Get versions list
export async function getVersions(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    if (!isUUID(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid post ID format');

    const post = await Post.findByPk(req.params.id);
    if (!post) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');

    if (post.authorId !== req.user.userId) {
      throw new AppError(403, 'FORBIDDEN', 'You can only view your own post versions');
    }

    const versions = await PostVersion.findAll({
      where: { postId: req.params.id },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'excerpt', 'createdAt', 'authorId', 'versionNumber'],
    });

    res.json({ versions });
  } catch (err) {
    next(err);
  }
}

// Get single version
export async function getVersion(req: Request<{ id: string; versionId: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    if (!isUUID(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid post ID format');
    if (!isUUID(req.params.versionId)) throw new AppError(400, 'INVALID_ID', 'Invalid version ID format');

    const post = await Post.findByPk(req.params.id);
    if (!post) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');

    if (post.authorId !== req.user.userId) {
      throw new AppError(403, 'FORBIDDEN', 'You can only view your own post versions');
    }

    const version = await PostVersion.findOne({
      where: { id: req.params.versionId, postId: req.params.id },
    });

    if (!version) {
      throw new AppError(404, 'VERSION_NOT_FOUND', 'Version not found');
    }

    res.json({ version });
  } catch (err) {
    next(err);
  }
}

// Compare two versions
export async function getDiff(
  req: Request<{ id: string }, {}, {}, { v1: string; v2: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    if (!isUUID(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid post ID format');

    const { v1, v2 } = req.query;
    if (!v1 || !v2) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Both v1 and v2 version IDs are required');
    }

    if (!isUUID(v1) || !isUUID(v2)) {
      throw new AppError(400, 'INVALID_ID', 'Invalid version ID format');
    }

    // Verify both versions belong to the user's post
    const post = await Post.findByPk(req.params.id);
    if (!post) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');

    if (post.authorId !== req.user.userId) {
      throw new AppError(403, 'FORBIDDEN', 'You can only compare versions from your own posts');
    }

    const diff = await diffService.computeDiff(v1, v2);
    res.json({ diff });
  } catch (err) {
    next(err);
  }
}

// Restore version (bonus)
export async function restoreVersion(
  req: Request<{ id: string; versionId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
    if (!isUUID(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid post ID format');
    if (!isUUID(req.params.versionId)) throw new AppError(400, 'INVALID_ID', 'Invalid version ID format');

    const post = await Post.findByPk(req.params.id);
    if (!post) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');

    if (post.authorId !== req.user.userId) {
      throw new AppError(403, 'FORBIDDEN', 'You can only restore versions in your own posts');
    }

    const oldVersion = await PostVersion.findOne({
      where: { id: req.params.versionId, postId: req.params.id },
    });

    if (!oldVersion) {
      throw new AppError(404, 'VERSION_NOT_FOUND', 'Version not found');
    }

    // Get the latest version number to increment it
    const latestVersion = await PostVersion.findOne({
      where: { postId: post.id },
      order: [['versionNumber', 'DESC']],
    });
    const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    // Create a new version with the old version's content
    const newVersion = await PostVersion.create({
      postId: post.id,
      title: oldVersion.title,
      content: oldVersion.content,
      contentText: oldVersion.contentText,
      excerpt: oldVersion.excerpt,
      authorId: req.user.userId,
      versionNumber: nextVersionNumber,
    });

    // Update post's current version and make it a draft if it was published
    const postUpdates: any = { currentVersionId: newVersion.id };
    if (post.status === 'published') {
      postUpdates.status = 'draft';
    }
    await post.update(postUpdates);

    res.json({ post: await post.reload({ include: [{ association: 'currentVersion' }] }), version: newVersion });
  } catch (err) {
    next(err);
  }
}

// Public search
export async function search(req: Request<{}, {}, {}, { q: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q } = req.query;
    if (!q) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Search query is required');
    }

    const results = await searchService.searchPosts(q, req.user?.userId);
    res.json({ results });
  } catch (err) {
    next(err);
  }
}

// Get published post by slug
export async function getPublishedPost(req: Request<{ slug: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.getPostBySlug(req.params.slug, req.user?.userId);
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// List published posts for blog
export async function getPublishedPosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const posts = await Post.findAll({
      where: { status: 'published' },
      include: [
        { association: 'currentVersion' },
        { association: 'author', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ posts });
  } catch (err) {
    next(err);
  }
}
