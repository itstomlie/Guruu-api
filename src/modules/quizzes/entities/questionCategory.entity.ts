import { Question } from './question.entity';
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
import { Quiz } from './quiz.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  TRUE_FALSE = 'true-false',
}

@Table({
  tableName: 'master_question_categories',
  timestamps: true,
  underscored: true,
})
export class QuestionCategory extends Model<QuestionCategory> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @AllowNull(false)
  @Default(QuestionType.MULTIPLE_CHOICE)
  @Column({
    type: DataType.ENUM(...Object.values(QuestionType)),
  })
  type: QuestionType;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @HasMany(() => Question)
  questions: Question[];
}
