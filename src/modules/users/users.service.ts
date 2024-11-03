import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(getModelToken(User))
    private readonly userRepo: typeof User,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    return this.userRepo.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.findAll<User>();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepo.findOne<User>({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }
    return user.update(updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await user.destroy();
    }
  }
}
