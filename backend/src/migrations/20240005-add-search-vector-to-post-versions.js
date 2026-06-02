'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the search_vector column as a GENERATED column directly
    await queryInterface.sequelize.query(`
      ALTER TABLE post_versions
      ADD COLUMN search_vector TSVECTOR
      GENERATED ALWAYS AS (
        to_tsvector('english',
          COALESCE(title, '') || ' ' || COALESCE(content_text, '')
        )
      ) STORED;
    `);

    // Create GIN index for fast search
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_post_versions_search_vector
      ON post_versions USING GIN(search_vector);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_post_versions_search_vector;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE post_versions DROP COLUMN IF EXISTS search_vector;
    `);
  },
};
