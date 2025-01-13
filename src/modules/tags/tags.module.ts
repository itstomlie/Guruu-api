import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/postTag.entity';
import { Post } from '../posts/entities/post.entity';
import { VideosService } from '../videos/videos.service';

@Module({
  imports: [SequelizeModule.forFeature([Tag, PostTag, Post])],
  controllers: [TagsController],
  providers: [TagsService, VideosService],
  exports: [TagsService],
})
export class TagsModule {}
