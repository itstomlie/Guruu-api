import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Waitlist } from './entities/waitlist.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: Partial<User>): Promise<User> {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'Username already exists, please try another username',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/waitlists')
  async createWaitlist(
    @Body() createWaitlist: Partial<Waitlist>,
  ): Promise<Waitlist> {
    try {
      const waitlist = await this.usersService.createWaitlist(createWaitlist);
      return waitlist;
    } catch (error) {
      throw new HttpException(
        'Failed to create waitlist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query()
    { email }: { email?: string },
  ) {
    return this.usersService.findAll({ email });
  }

  @Get(':id/character')
  async findOneCharacter(@Param('id') id: string): Promise<any> {
    const character = await this.usersService.findOneCharacterByUserId(id);
    if (!character) {
      throw new HttpException('Character not found', HttpStatus.NOT_FOUND);
    }

    return character;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException('Failed to update user', HttpStatus.BAD_REQUEST);
    }
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
