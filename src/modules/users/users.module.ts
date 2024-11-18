import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Character } from './entities/character.entity';
import { PostsService } from '../posts/posts.service';
import { PostsModule } from '../posts/posts.module';
import { Waitlist } from './entities/waitlist.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Character, Waitlist]),
    PostsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
