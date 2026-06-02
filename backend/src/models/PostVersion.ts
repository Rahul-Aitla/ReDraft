import { Model, DataTypes, Sequelize } from 'sequelize';
import type { TipTapDoc } from '../types';

export class PostVersion extends Model {
  declare id: string;
  declare postId: string;
  declare title: string;
  declare content: TipTapDoc;
  declare contentText: string;
  declare excerpt: string | null;
  declare authorId: string;
  declare versionNumber: number;
  declare searchVector: any;
  declare createdAt: Date;
}

export function initPostVersionModel(sequelize: Sequelize): typeof PostVersion {
  PostVersion.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'post_id',
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      content: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      contentText: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        field: 'content_text',
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'author_id',
      },
      versionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'version_number',
      },
      searchVector: {
        type: DataTypes.TSVECTOR,
        allowNull: true,
        field: 'search_vector',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      sequelize,
      tableName: 'post_versions',
      underscored: true,
      timestamps: false,
    }
  );

  return PostVersion;
}
