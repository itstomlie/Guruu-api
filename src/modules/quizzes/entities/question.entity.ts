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
  HasOne,
} from 'sequelize-typescript';
import { Quiz } from './quiz.entity';
import { QuestionCategory } from './questionCategory.entity';
import { Option } from './option.entity';
import { Answer } from './answer.entity';

@Table({
  tableName: 'questions',
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

  @AllowNull(false)
  @ForeignKey(() => Quiz)
  @Column({
    type: DataType.STRING(50),
  })
  quizId: string;

  @AllowNull(false)
  @ForeignKey(() => QuestionCategory)
  @Column({
    type: DataType.STRING(50),
  })
  categoryId: string;

  @Column({
    type: DataType.TEXT,
  })
  title: string;

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

  @HasMany(() => Option)
  options: Option[];

  @HasOne(() => Answer)
  answer: Answer;
}
