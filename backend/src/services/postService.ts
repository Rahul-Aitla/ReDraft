import { Post, PostVersion } from '../models';
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
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new AppError(403, 'FORBIDDEN', 'You can only edit your own posts');
  }

  let version: PostVersion | null = null;

  // If content or title changed, create a new version
  if (updates.content || updates.title) {
    const currentVersion = await PostVersion.findByPk(post.currentVersionId ?? undefined);
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
    });

    // Update post's current version
    await post.update({ currentVersionId: version.id });
  }

  // Update status if provided
  if (updates.status) {
    await post.update({ status: updates.status });
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

  await post.update({ status: 'published' });
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

export async function getPostBySlug(slug: string): Promise<Post> {
  const post = await Post.findOne({
    where: { slug, status: 'published' },
    include: [{ association: 'currentVersion' }],
  });

  if (!post) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found');
  }

  return post;
}
