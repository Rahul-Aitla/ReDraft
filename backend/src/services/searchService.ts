import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database';
import type { SearchResult } from '../types';
import { AppError } from '../middleware/errorHandler';

export async function searchPosts(query: string, _userId?: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    throw new AppError(400, 'EMPTY_QUERY', 'Search query cannot be empty');
  }

  try {
    const results = await sequelize.query(
      `SELECT 
        p.id, 
        p.slug, 
        pv.title, 
        pv.excerpt,
        ts_headline('english', pv.content_text, websearch_to_tsquery('english', :query), 'StartSel=<b>, StopSel=</b>, MaxWords=35, MinWords=15, ShortWord=3, MaxFragments=2, FragmentDelimiter=" ... "') AS headline,
        ts_rank(pv.search_vector, websearch_to_tsquery('english', :query)) AS rank
       FROM posts p
       JOIN post_versions pv ON p.current_version_id = pv.id
       WHERE (p.status = 'published')
         AND (pv.search_vector @@ websearch_to_tsquery('english', :query)
              OR pv.title ILIKE :likeQuery)
       ORDER BY rank DESC, p.created_at DESC
       LIMIT 20`,
      {
        replacements: { 
          query,
          likeQuery: `%${query}%`
        },
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
