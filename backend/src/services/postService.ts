import { Post, PostVersion } from '../models';
import { Op } from 'sequelize';
import { extractText } from '../utils/tiptap';
import { generateSlug, generateUniqueSlug } from '../utils/slug';
import type { TipTapDoc } from '../types';
import { AppError } from '../middleware/errorHandler';

export async function createPost(
  title: string,
  content: TipTapDoc,
  excerpt: string | null,
  authorId: string
): Promise<{ post: Post; version: PostVersion }> {
  if (!authorId) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Author ID is missing. Please re-login.');
  }

  let slug = generateSlug(title);
  let slugTaken = await Post.findOne({ where: { slug } });
  let counter = 1;

  while (slugTaken) {
    slug = generateUniqueSlug(generateSlug(title), counter);
    slugTaken = await Post.findOne({ where: { slug } });
    counter++;
  }

  const post = await Post.create({
    slug,
    status: 'draft',
    authorId,
  });

  const contentText = extractText(content);
  const version = await PostVersion.create({
    postId: post.id,
    title,
    content,
    contentText,
    excerpt,
    authorId,
    versionNumber: 1,
  });

  // Update post with current version
  await post.update({ currentVersionId: version.id });

  return { post, version };
}

export async function updatePost(
  postId: string,
  userId: string,
  updates: {
    title?: string;
    content?: TipTapDoc;
    excerpt?: string | null;
    status?: 'draft' | 'published';
  }
): Promise<{ post: Post; version: PostVersion | null }> {
  if (!userId) {
    throw new AppError(401, 'AUTH_REQUIRED', 'User ID is missing. Please re-login.');
  }

  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new AppError(403, 'FORBIDDEN', 'You can only edit your own posts');
  }

  let version: PostVersion | null = null;

  // If content, title, or excerpt changed, create a new version
  if (updates.content || updates.title || updates.excerpt !== undefined) {
    const currentVersion = await PostVersion.findByPk(post.currentVersionId ?? undefined);
    const nextVersionNumber = (currentVersion?.versionNumber || 0) + 1;

    const title = updates.title || currentVersion?.title || 'Untitled';
    const content = updates.content || currentVersion?.content || { type: 'doc', content: [] };
    const excerpt = updates.excerpt !== undefined ? updates.excerpt : currentVersion?.excerpt || null;

    const contentText = extractText(content);
    version = await PostVersion.create({
      postId: post.id,
      title,
      content,
      contentText,
      excerpt,
      authorId: userId,
      versionNumber: nextVersionNumber,
    });

    // Update post's current version
    await post.update({ currentVersionId: version.id });

    // If the post is published, any edits automatically make it a draft
    if (post.status === 'published') {
      updates.status = 'draft';
    }
  }

  // Update status and publishedAt if provided
  if (updates.status) {
    const statusUpdate: any = { status: updates.status };
    if (updates.status === 'published' && post.status !== 'published') {
      statusUpdate.publishedAt = new Date();
    }
    await post.update(statusUpdate);
  }

  // Reload post to get updated data
  await post.reload({ include: [{ association: 'currentVersion' }] });

  return { post, version };
}

export async function publishPost(postId: string, userId: string): Promise<Post> {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new AppError(403, 'FORBIDDEN', 'You can only publish your own posts');
  }

  await post.update({ 
    status: 'published',
    publishedAt: post.publishedAt || new Date()
  });
  return post;
}

export async function unpublishPost(postId: string, userId: string): Promise<Post> {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new AppError(403, 'FORBIDDEN', 'You can only unpublish your own posts');
  }

  await post.update({ status: 'draft' });
  return post;
}

export async function getPostsByAuthor(userId: string): Promise<Post[]> {
  return Post.findAll({
    where: { authorId: userId },
    include: [{ association: 'currentVersion' }],
    order: [['updatedAt', 'DESC']],
  });
}

export async function getPost(postId: string, userId?: string): Promise<Post> {
  // Guard against non-UUID strings like "new" or "undefined"
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(postId)) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Invalid post ID format');
  }

  const post = await Post.findByPk(postId, {
    include: [{ association: 'currentVersion' }],
  });

  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
  }

  // If user is not the author and post is not published, deny access
  if (userId && post.authorId !== userId && post.status !== 'published') {
    throw new AppError(403, 'FORBIDDEN', 'You can only view published posts or your own posts');
  }

  if (!userId && post.status !== 'published') {
    throw new AppError(403, 'FORBIDDEN', 'This post is not published');
  }

  return post;
}

export async function getPostBySlug(slug: string, userId?: string): Promise<Post> {
  const post = await Post.findOne({
    where: userId 
      ? {
          slug,
          [Op.or]: [
            { status: 'published' },
            { authorId: userId }
          ]
        }
      : { slug, status: 'published' },
    include: [
      { association: 'currentVersion' },
      { association: 'author', attributes: ['id', 'name', 'email'] }
    ],
  });

  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
  }

  return post;
}
