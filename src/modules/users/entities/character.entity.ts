import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
  tableName: 'characters',
  timestamps: true,
  underscored: true,
})
export class Character extends Model<Character> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Default(1)
  @Column({
    type: DataType.INTEGER,
  })
  level: number;

  @Column({
    type: DataType.STRING(100),
  })
  title: string;

  @Default(5)
  @Column({
    type: DataType.INTEGER,
  })
  health: number;

  @Default(5)
  @Column({
    type: DataType.INTEGER,
  })
  maxHealth: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  experience: number;

  @Default(25)
  @Column({
    type: DataType.INTEGER,
  })
  maxExperience: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  coins: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  gems: number;

  @Column({
    type: DataType.DATE,
  })
  lastHpUpdateTime: Date;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}
