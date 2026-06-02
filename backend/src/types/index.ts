export interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
}

export interface TipTapDoc {
  type: 'doc';
  content: TipTapNode[];
}

export interface Author {
  id: string;
  email: string;
  name: string;
}

export interface Post {
  id: string;
  slug: string;
  status: 'draft' | 'published';
  authorId: string;
  currentVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  currentVersion?: PostVersion;
}

export interface PostVersion {
  id: string;
  postId: string;
  title: string;
  content: TipTapDoc;
  contentText: string;
  excerpt: string | null;
  authorId: string;
  createdAt: string;
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
  headline: string;
  rank: number;
}

export interface AuthPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
