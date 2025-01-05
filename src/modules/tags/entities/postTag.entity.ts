import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { Post } from '../../posts/entities/post.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Table({
  tableName: 'post_tags',
  timestamps: true,
  underscored: true,
})
export class PostTag extends Model<PostTag> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => Post)
  @Column({
    type: DataType.STRING(50),
  })
  postId: string;

  @AllowNull(false)
  @ForeignKey(() => Tag)
  @Column({
    type: DataType.STRING(50),
  })
  tagId: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;
}
