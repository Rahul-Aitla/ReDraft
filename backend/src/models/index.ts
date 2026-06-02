import { Sequelize } from 'sequelize';
import { User, initUserModel } from './User';
import { Post, initPostModel } from './Post';
import { PostVersion, initPostVersionModel } from './PostVersion';

export async function initializeModels(sequelize: Sequelize) {
  initUserModel(sequelize);
  initPostModel(sequelize);
  initPostVersionModel(sequelize);

  defineAssociations();

  // Enable uuid extension for PostgreSQL
  try {
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  } catch (err) {
    console.warn('Could not create uuid-ossp extension (may already exist)');
  }
}

export function defineAssociations() {
  // User → Posts
  User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
  Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

  // Post → PostVersions
  Post.hasMany(PostVersion, { foreignKey: 'postId', as: 'versions' });
  PostVersion.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

  // Post → currentVersion (one-to-one via currentVersionId)
  Post.belongsTo(PostVersion, { foreignKey: 'currentVersionId', as: 'currentVersion' });

  // User → PostVersions (who authored each save)
  User.hasMany(PostVersion, { foreignKey: 'authorId', as: 'versions' });
  PostVersion.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
}

export { User, Post, PostVersion };
