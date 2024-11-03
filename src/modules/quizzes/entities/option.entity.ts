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
import { Question } from './question.entity';

@Table({
  tableName: 'options',
  timestamps: true,
  underscored: true,
})
export class Option extends Model<Option> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @ForeignKey(() => Question)
  @Column({
    type: DataType.STRING(50),
  })
  questionId: string;

  @Column({
    type: DataType.TEXT,
  })
  option: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsTo(() => Question)
  question: Question;
}
