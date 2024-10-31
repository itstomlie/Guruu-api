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
} from 'sequelize-typescript';
import { Quiz } from './quiz.entity';
import { QuestionCategory } from './questionCategory.entity';

@Table({
  tableName: 'master_questions',
  timestamps: true,
  underscored: true,
})
export class Question extends Model<Question> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @ForeignKey(() => Quiz)
  @Column({
    type: DataType.STRING(50),
  })
  quizId: string;

  @Unique
  @AllowNull(false)
  @ForeignKey(() => QuestionCategory)
  @Column({
    type: DataType.STRING(50),
  })
  categoryId: string;

  @Column({
    type: DataType.TEXT,
  })
  question: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsTo(() => Quiz)
  quiz: Quiz;

  @BelongsTo(() => QuestionCategory)
  questionCategory: QuestionCategory;
}
