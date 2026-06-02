import { Model, DataTypes, Sequelize } from 'sequelize';

export type PostStatus = 'draft' | 'published';

export class Post extends Model {
  declare id: string;
  declare slug: string;
  declare status: PostStatus;
  declare authorId: string;
  declare currentVersionId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initPostModel(sequelize: Sequelize): typeof Post {
  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'draft',
        validate: {
          isIn: [['draft', 'published']],
        },
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'author_id',
      },
      currentVersionId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'current_version_id',
      },
    },
    {
      sequelize,
      tableName: 'posts',
      underscored: true,
      timestamps: true,
    }
  );

  return Post;
}
