import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query()
    {
      userId,
      page,
      size,
      tags,
    }: {
      userId?: string;
      page?: string;
      size?: string;
      tags?: string;
    },
  ) {
    return this.postsService.findAll({
      userId,
      page: Number(page),
      size: Number(size),
      tags,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('🚀 ~ PostsController ~ findOne ~ id:', id);
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
