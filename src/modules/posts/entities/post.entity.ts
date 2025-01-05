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
import { Tag } from '../../tags/entities/tag.entity';
import { PostTag } from '../../tags/entities/postTag.entity';

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum Status {
  WAITING_FOR_APPROVAL = 'waiting-for-approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DRAFT = 'draft',
  POSTED = 'posted',
  BANNED = 'banned',
}

@Table({
  tableName: 'posts',
  timestamps: true,
  underscored: true,
})
export class Post extends Model<Post> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING(50),
  })
  userId: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  videoUrl: string;

  @Column({
    type: DataType.STRING(),
  })
  thumbnailUrl: string;

  @Column({
    type: DataType.TEXT,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  caption: string;

  @AllowNull(false)
  @Default(PostVisibility.PUBLIC)
  @Column({
    type: DataType.ENUM(...Object.values(PostVisibility)),
  })
  visibility: PostVisibility;

  @AllowNull(false)
  @Default(Status.POSTED)
  @Column({
    type: DataType.ENUM(...Object.values(Status)),
  })
  status: Status;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;

  @HasOne(() => Quiz)
  quiz: Quiz;

  @BelongsToMany(() => Tag, () => PostTag)
  tags: Tag[];
}
