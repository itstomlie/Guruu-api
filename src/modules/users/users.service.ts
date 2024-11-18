import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Character } from './entities/character.entity';
import { PostsService } from '../posts/posts.service';
import { Waitlist } from './entities/waitlist.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(getModelToken(User))
    private readonly userRepo: typeof User,

    @Inject(getModelToken(Character))
    private readonly characterRepo: typeof Character,

    @Inject(getModelToken(Waitlist))
    private readonly waitlistRepo: typeof Waitlist,

    private readonly postsService: PostsService,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    const user = await this.userRepo.create(createUserDto);

    await this.characterRepo.create({
      userId: user.id,
      level: 1,
      title: 'Newbie',
      health: 5,
      experience: 0,
      coins: 0,
      gems: 0,
    });
    return user;
  }

  async createWaitlist(createWaitlist: Partial<Waitlist>): Promise<Waitlist> {
    const waitlist = await this.waitlistRepo.create(createWaitlist);

    return waitlist;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.findAll<User>();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOne<User>({
      where: { id },
      include: {
        model: Character,
        attributes: [
          'id',
          'title',
          'level',
          'health',
          'experience',
          'coins',
          'gems',
          'maxHealth',
          'maxExperience',
        ],
      },
    });
  }

  async findOneCharacterByUserId(userId: string): Promise<Character> {
    return this.characterRepo.findOne<Character>({
      where: { userId },
      attributes: [
        'id',
        'title',
        'level',
        'health',
        'experience',
        'coins',
        'gems',
        'maxHealth',
        'maxExperience',
      ],
    });
  }

  async findPostsByUserId(userId: string) {
    return this.postsService.findPostsByUserId(userId);
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }
    return user.update(updateUserDto);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await user.update({ deletedAt: new Date() });
  }
}
