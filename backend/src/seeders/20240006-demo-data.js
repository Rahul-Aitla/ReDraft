'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fixed UUIDs for reproducible seeds
    const userId1 = '11111111-1111-1111-1111-111111111111';
    const userId2 = '22222222-2222-2222-2222-222222222222';

    const postId1 = '33333333-3333-3333-3333-333333333333';
    const postId2 = '44444444-4444-4444-4444-444444444444';
    const postId3 = '55555555-5555-5555-5555-555555555555';
    const postId4 = '66666666-6666-6666-6666-666666666666';
    const postId5 = '77777777-7777-7777-7777-777777777777';

    const versionId1 = '88888881-8888-8888-8888-888888888888';
    const versionId2 = '88888882-8888-8888-8888-888888888888';
    const versionId3 = '88888883-8888-8888-8888-888888888888';
    const versionId4 = '88888884-8888-8888-8888-888888888888';
    const versionId5 = '88888885-8888-8888-8888-888888888888';
    const versionId6 = '88888886-8888-8888-8888-888888888888';
    const versionId7 = '88888887-8888-8888-8888-888888888888';
    const versionId8 = '88888888-8888-8888-8888-888888888888';

    const now = new Date();

    // 1. Insert users
    await queryInterface.bulkInsert('users', [
      {
        id: userId1,
        email: 'alice@demo.com',
        name: 'Alice Chen',
        password_hash: await bcrypt.hash('password123', 12),
        created_at: now,
        updated_at: now,
      },
      {
        id: userId2,
        email: 'bob@demo.com',
        name: 'Bob Sharma',
        password_hash: await bcrypt.hash('password123', 12),
        created_at: now,
        updated_at: now,
      },
    ], { ignoreDuplicates: true });

    // 2. Insert posts FIRST (with current_version_id = null since versions don't exist yet)
    await queryInterface.bulkInsert('posts', [
      {
        id: postId1,
        slug: 'getting-started-with-typescript',
        status: 'published',
        author_id: userId1,
        current_version_id: null,
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: postId2,
        slug: 'advanced-postgresql-tricks',
        status: 'published',
        author_id: userId1,
        current_version_id: null,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: postId3,
        slug: 'building-rest-apis-with-express',
        status: 'published',
        author_id: userId2,
        current_version_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: postId4,
        slug: 'draft-my-thoughts-on-react-19',
        status: 'draft',
        author_id: userId1,
        current_version_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: postId5,
        slug: 'draft-upcoming-tutorial-series',
        status: 'draft',
        author_id: userId2,
        current_version_id: null,
        created_at: now,
        updated_at: now,
      },
    ], { ignoreDuplicates: true });

    // 3. Insert post_versions (posts now exist)
    await queryInterface.bulkInsert('post_versions', [
      {
        id: versionId1,
        post_id: postId1,
        title: 'Getting Started with TypeScript',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Learn the basics of TypeScript and how it can improve your JavaScript development.',
                },
              ],
            },
          ],
        }),
        content_text: 'Learn the basics of TypeScript and how it can improve your JavaScript development.',
        excerpt: 'An introduction to TypeScript',
        author_id: userId1,
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: versionId2,
        post_id: postId1,
        title: 'Getting Started with TypeScript - Updated',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Learn the basics of TypeScript and how it can dramatically improve your JavaScript development workflow.',
                },
              ],
            },
          ],
        }),
        content_text: 'Learn the basics of TypeScript and how it can dramatically improve your JavaScript development workflow.',
        excerpt: 'An introduction to TypeScript with practical examples',
        author_id: userId1,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: versionId3,
        post_id: postId1,
        title: 'Getting Started with TypeScript',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Learn the basics and improve your development experience.',
                },
              ],
            },
          ],
        }),
        content_text: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Learn the basics and improve your development experience.',
        excerpt: 'An introduction to TypeScript',
        author_id: userId1,
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: versionId4,
        post_id: postId2,
        title: 'Advanced PostgreSQL Tricks',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Discover advanced techniques and tricks to optimize your PostgreSQL queries and database design.',
                },
              ],
            },
          ],
        }),
        content_text: 'Discover advanced techniques and tricks to optimize your PostgreSQL queries and database design.',
        excerpt: 'Expert tips for PostgreSQL',
        author_id: userId1,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: versionId5,
        post_id: postId2,
        title: 'Advanced PostgreSQL Tricks',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Master advanced PostgreSQL techniques including indexing, query optimization, and window functions to boost your database performance.',
                },
              ],
            },
          ],
        }),
        content_text: 'Master advanced PostgreSQL techniques including indexing, query optimization, and window functions to boost your database performance.',
        excerpt: 'Expert tips for PostgreSQL',
        author_id: userId1,
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: versionId6,
        post_id: postId3,
        title: 'Building REST APIs with Express',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Build scalable and maintainable REST APIs using Express.js with best practices and patterns.',
                },
              ],
            },
          ],
        }),
        content_text: 'Build scalable and maintainable REST APIs using Express.js with best practices and patterns.',
        excerpt: 'Guide to REST APIs with Express',
        author_id: userId2,
        created_at: now,
      },
      {
        id: versionId7,
        post_id: postId4,
        title: 'Draft: My Thoughts on React 19',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Exploring the new features in React 19 and how they might change the way we build applications.',
                },
              ],
            },
          ],
        }),
        content_text: 'Exploring the new features in React 19 and how they might change the way we build applications.',
        excerpt: 'Thoughts on React 19',
        author_id: userId1,
        created_at: now,
      },
      {
        id: versionId8,
        post_id: postId5,
        title: 'Draft: Upcoming Tutorial Series',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'I have some great tutorials planned for next month.',
                },
              ],
            },
          ],
        }),
        content_text: 'I have some great tutorials planned for next month.',
        excerpt: 'Upcoming content',
        author_id: userId2,
        created_at: now,
      },
    ], { ignoreDuplicates: true });

    // 4. Now update posts with their current_version_id
    await queryInterface.sequelize.query(`
      UPDATE posts SET current_version_id = '${versionId3}' WHERE id = '${postId1}';
      UPDATE posts SET current_version_id = '${versionId5}' WHERE id = '${postId2}';
      UPDATE posts SET current_version_id = '${versionId6}' WHERE id = '${postId3}';
      UPDATE posts SET current_version_id = '${versionId7}' WHERE id = '${postId4}';
      UPDATE posts SET current_version_id = '${versionId8}' WHERE id = '${postId5}';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('post_versions', {});
    await queryInterface.bulkDelete('posts', {});
    await queryInterface.bulkDelete('users', {});
  },
};
