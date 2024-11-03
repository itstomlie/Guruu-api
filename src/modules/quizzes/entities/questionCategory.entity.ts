import { Question } from './question.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';

@Table({
  tableName: 'question_categories',
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
  @Column({
    type: DataType.STRING(50),
  })
  type: string;

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
