import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { Tag } from '../tags/entities/tag.entity';
import { PostTag } from '../tags/entities/postTag.entity';

@Module({
  imports: [SequelizeModule.forFeature([Post, Tag, PostTag]), QuizzesModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
