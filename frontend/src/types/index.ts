// Shared between backend and frontend

export const VERSION = '1.0.0';

export interface Author {
  id: string;
  email: string;
  name: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: 'draft' | 'published';
  authorId: string;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
  currentVersion?: PostVersion;
  author?: Author;
}

export interface PostVersion {
  id: string;
  postId: string;
  title: string;
  versionNumber: number;
  content: TipTapDoc;      // raw TipTap JSON
  contentText: string;     // plain text extraction
  excerpt: string;
  authorId: string;
  createdAt: string;
}

export interface TipTapDoc {
  type: 'doc';
  content: TipTapNode[];
}

export interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
}

export interface DiffSegment {
  type: 'equal' | 'insert' | 'delete';
  text: string;
}

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  headline: string;   // HTML string with <b> tags from ts_headline
  rank: number;
}
