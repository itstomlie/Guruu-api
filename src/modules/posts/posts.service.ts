import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../users/user.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(getModelToken(Post))
    private readonly postModel: typeof Post,
  ) {}
  async create(createPostDto: Partial<CreatePostDto>): Promise<Post> {
    console.log('🚀 ~ PostsService ~ create ~ createPostDto:', createPostDto);
    // {
    //   title: 'heavy water',
    //   caption: 'lala',
    //   hashtags: 'lulu',
    //   videoUrl: 'https://crilujirdfczplpdeltx.supabase.co/storage/v1/object/public/videos/public/Thu%20Oct%2031%202024%2015:25:57%20GMT+0800-1000000019.mp4',
    //   thumbnailUrl: 'This is a thumbnail url',
    //   visibility: 'public',
    //   status: 'posted',
    //   questions: [
    //     {
    //       id: '',
    //       title: 'whatt?',
    //       type: 'multiple-choice',
    //       options: [Array],
    //       answer: 'best'
    //     }
    //   ]
    // }
    return this.postModel.create(createPostDto);
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
