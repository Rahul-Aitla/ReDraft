'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('posts', {
      fields: ['current_version_id'],
      type: 'foreign key',
      name: 'fk_current_version',
      references: {
        table: 'post_versions',
        field: 'id',
      },
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('posts', 'fk_current_version');
  },
};
