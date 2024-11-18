import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'waitlists',
  timestamps: true,
  underscored: true,
})
export class Waitlist extends Model<Waitlist> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING(50),
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
  })
  email: string;

  @Column({
    type: DataType.TEXT,
  })
  message: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  creator: string;

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
