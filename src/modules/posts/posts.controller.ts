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
import { JwtAuthGuard } from 'src/common/auth/guards/jwt.auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query()
    {
      userId,
      size,
      tags,
      cursor,
      search,
      status,
      postId,
    }: {
      userId?: string;
      size?: string;
      tags?: string;
      cursor?: string;
      search?: string;
      status?: string;
      postId?: string;
    },
  ) {
    return this.postsService.findAll({
      userId,
      size: Number(size),
      tags,
      cursor,
      search,
      status,
      postId,
    });
  }

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  findPostsByUserId(
    @Param('id') id: string,
    @Query() { cursor, status }: { cursor?: string; status?: string },
  ) {
    return this.postsService.findPostsByUserId({ userId: id, status, cursor });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
