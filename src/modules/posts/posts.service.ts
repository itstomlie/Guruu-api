import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getModelToken } from '@nestjs/sequelize';
import { Post, PostVisibility, Status } from './entities/post.entity';
import { QuizzesService } from '../quizzes/quizzes.service';
import { User } from '../users/entities/user.entity';
import { Quiz, QuizStatus } from '../quizzes/entities/quiz.entity';
import { Tag } from './entities/tag.entity';
import Pagination from 'src/common/helpers/pagination';
import { Op, where } from 'sequelize';
import moment from 'moment';
import * as dayjs from 'dayjs';
import { literal } from 'sequelize';

@Injectable()
export class PostsService {
  constructor(
    @Inject(getModelToken(Post))
    private readonly postRepo: typeof Post,
    private readonly quizzesService: QuizzesService,
  ) {}

  async create(createPostDto: Partial<CreatePostDto>): Promise<Post> {
    let post;

    if (createPostDto.id) {
      post = await this.postRepo.findOne({
        where: { id: createPostDto.id },
      });

      if (!post)
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

      if (createPostDto.questions && createPostDto.questions.length > 0) {
        console.log(
          '🚀 ~ PostsService ~ create ~ createPostDto.id:',
          createPostDto.id,
        );
        let quiz = await this.quizzesService.findOneByPostId(createPostDto.id);
        console.log('🚀 ~ PostsService ~ create ~ quiz:', quiz);

        if (quiz) {
          await this.quizzesService.update(quiz.id, {
            status: QuizStatus.INACTIVE,
          });
        }

        await this.quizzesService.createQuiz({
          postId: createPostDto.id,
          questions: createPostDto.questions,
        });
      }
    } else {
      post = await this.postRepo.create({
        ...createPostDto,
        status: Status.DRAFT,
      });

      if (createPostDto.questions && createPostDto.questions.length > 0) {
        await this.quizzesService.createQuiz({
          postId: post.id,
          questions: createPostDto.questions,
          status: QuizStatus.ACTIVE,
        });
      }
      return post;
    }
  }

  async findAll({
    userId,
    size,
    tags,
    cursor,
  }: {
    userId?: string;
    size?: number;
    tags?: string;
    cursor?: string;
  }) {
    const whereClause: any = {
      status: Status.POSTED,
      visibility: PostVisibility.PUBLIC,
    };

    if (cursor) {
      whereClause.createdAt = {
        [Op.lte]: literal(`'${cursor}'`),
      };
    }

    const posts = await this.postRepo.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: size || 3,
      attributes: [
        'id',
        'videoUrl',
        'thumbnailUrl',
        'title',
        'caption',
        'createdAt',
      ],
      include: [
        {
          model: User,
          attributes: ['username', 'profilePictureUrl'],
          ...(userId && { where: { id: userId } }),
        },
        {
          model: Quiz,
          attributes: ['id'],
        },
        {
          model: Tag,
          attributes: ['id', 'tag'],
          required: false,
          ...(tags && { where: { tag: tags.split(',') } }),
        },
      ],
    });

    return {
      posts,
      nextCursor:
        posts.length > 0
          ? new Date(posts[posts.length - 1].createdAt).toLocaleString()
          : null,
    };
  }

  findOne(id: string) {
    return this.postRepo.findOne({
      where: { id },
      attributes: [
        'id',
        'videoUrl',
        'thumbnailUrl',
        'title',
        'caption',
        'createdAt',
      ],
      include: [
        {
          model: User,
          attributes: ['username', 'profilePictureUrl'],
        },
        {
          model: Quiz,
          attributes: ['id'],
        },
        {
          model: Tag,
          attributes: ['id', 'tag'],
        },
      ],
    });
  }

  async findPostsByUserId(userId: string) {
    const posts = await this.postRepo.findAll({
      where: {
        userId: userId,
      },
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'videoUrl',
        'thumbnailUrl',
        'title',
        'caption',
        'createdAt',
      ],
    });

    return posts;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
