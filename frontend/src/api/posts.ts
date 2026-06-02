import client from './client';
import type { Post, PostVersion, DiffSegment, SearchResult, TipTapDoc } from '../types';

export const fetchMyPosts = async () => {
  const { data } = await client.get<{ posts: Post[] }>('/posts');
  return data.posts;
};

export const fetchPost = async (id: string) => {
  const { data } = await client.get<{ post: Post }>(`/posts/${id}`);
  return data.post;
};

export const createPost = async (payload: { title: string; content: TipTapDoc; excerpt: string }) => {
  const { data } = await client.post<{ post: Post; version: PostVersion }>('/posts', payload);
  return data;
};

export const updatePost = async (id: string, payload: { title?: string; content?: TipTapDoc; excerpt?: string }) => {
  const { data } = await client.patch<{ post: Post; version: PostVersion | null }>(`/posts/${id}`, payload);
  return data;
};

export const publishPost = async (id: string) => {
  const { data } = await client.patch<{ post: Post }>(`/posts/${id}/publish`);
  return data.post;
};

export const unpublishPost = async (id: string) => {
  const { data } = await client.patch<{ post: Post }>(`/posts/${id}/unpublish`);
  return data.post;
};

export const fetchVersions = async (postId: string) => {
  const { data } = await client.get<{ versions: PostVersion[] }>(`/posts/${postId}/versions`);
  return data.versions;
};

export const fetchVersion = async (postId: string, versionId: string) => {
  const { data } = await client.get<{ version: PostVersion }>(`/posts/${postId}/versions/${versionId}`);
  return data.version;
};

export const fetchDiff = async (postId: string, v1: string, v2: string) => {
  const { data } = await client.get<{ diff: DiffSegment[] }>(`/posts/${postId}/diff`, {
    params: { v1, v2 },
  });
  return data.diff;
};

export const restoreVersion = async (postId: string, versionId: string) => {
  const { data } = await client.post<{ post: Post }> (`/posts/${postId}/restore/${versionId}`);
  return data.post;
};

export const searchPosts = async (q: string) => {
  const { data } = await client.get<{ results: SearchResult[] }>('/search', { params: { q } });
  return data.results;
};

export const fetchPublicPosts = async () => {
  const { data } = await client.get<{ posts: Post[] }>('/blog');
  return data.posts;
};

export const fetchPublicPostBySlug = async (slug: string) => {
  const { data } = await client.get<{ post: Post }>(`/blog/${slug}`);
  return data.post;
};
