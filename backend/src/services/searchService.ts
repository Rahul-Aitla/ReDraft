import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database';
import type { SearchResult } from '../types';
import { AppError } from '../middleware/errorHandler';

export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    throw new AppError(400, 'EMPTY_QUERY', 'Search query cannot be empty');
  }

  // Prepare the search query for PostgreSQL tsvector
  // Convert spaces to & for AND operation
  const searchQuery = query
    .trim()
    .split(/\s+/)
    .join(' & ');

  try {
    const results = await sequelize.query(
      `SELECT 
        p.id, 
        p.slug, 
        pv.title, 
        pv.excerpt,
        ts_headline('english', pv.content_text, query) AS headline,
        ts_rank(pv.search_vector, query) AS rank
       FROM posts p
       JOIN post_versions pv ON p.current_version_id = pv.id,
            to_tsquery('english', :query) query
       WHERE p.status = 'published'
         AND pv.search_vector @@ query
       ORDER BY rank DESC
       LIMIT 20`,
      {
        replacements: { query: searchQuery },
        type: QueryTypes.SELECT,
      }
    );

    return (results as unknown[]).map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt || '',
      headline: row.headline || '',
      rank: parseFloat(row.rank) || 0,
    }));
  } catch (err) {
    console.error('Search error:', err);
    throw new AppError(500, 'SEARCH_ERROR', 'Failed to search posts');
  }
}
