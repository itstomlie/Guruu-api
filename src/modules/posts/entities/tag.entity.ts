import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  Unique,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Quiz } from 'src/modules/quizzes/entities/quiz.entity';
import { Post } from './post.entity';
import { PostTag } from './postTag.entity';

@Table({
  tableName: 'tags',
  timestamps: true,
  underscored: true,
})
export class Tag extends Model<Tag> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
  })
  tag: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsToMany(() => Post, () => PostTag)
  posts: Post[];
}
