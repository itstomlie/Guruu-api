import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  Unique,
  AllowNull,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { Post } from '../../posts/entities/post.entity';
import { Character } from './character.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  username: string;

  @Column({
    type: DataType.TEXT,
  })
  firstName: string;

  @Column({
    type: DataType.TEXT,
  })
  lastName: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
  })
  profilePictureUrl: string;

  @Column({
    type: DataType.TEXT,
  })
  bio: string;

  @AllowNull(false)
  @Default(UserRole.USER)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
  })
  role: UserRole;

  @Column({
    type: DataType.DATE,
  })
  lastLogin: Date;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @Column({
    type: DataType.DATE,
  })
  deletedAt: Date;

  @HasMany(() => Post)
  posts: Post[];

  @HasOne(() => Character)
  character: Character;
}
