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
    },
    {
      sequelize,
      tableName: 'post_versions',
      underscored: true,
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return PostVersion;
}
