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
  HasMany,
} from 'sequelize-typescript';

import { Post } from 'src/modules/posts/entities/post.entity';
import { Question } from './question.entity';

export enum QuizStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'quizzes',
  timestamps: true,
  underscored: true,
})
export class Quiz extends Model<Quiz> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @ForeignKey(() => Post)
  @Column({
    type: DataType.STRING(50),
  })
  postId: string;

  @Column({
    type: DataType.TEXT,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @AllowNull(false)
  @Default(QuizStatus.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(QuizStatus)),
  })
  status: QuizStatus;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsTo(() => Post)
  post: Post;

  @HasMany(() => Question)
  questions: Question[];
}
