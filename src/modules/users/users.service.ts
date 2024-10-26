import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(getModelToken(User))
    private readonly userModel: typeof User,
  ) {}

  // Create a new user
  async create(createUserDto: Partial<User>): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return this.userModel.findAll<User>();
  }

  // Retrieve a single user by ID
  async findOne(id: number): Promise<User> {
    return this.userModel.findOne<User>({
      where: { id },
    });
  }

  // Update a user by ID
  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }
    return user.update(updateUserDto);
  }

  // Delete a user by ID
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await user.destroy();
    }
  }
}
