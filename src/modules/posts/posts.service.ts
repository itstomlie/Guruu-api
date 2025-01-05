import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getModelToken } from '@nestjs/sequelize';
import { Post, PostVisibility, Status } from './entities/post.entity';
import { QuizzesService } from '../quizzes/quizzes.service';
import { User } from '../users/entities/user.entity';
import { Quiz, QuizStatus } from '../quizzes/entities/quiz.entity';
import { Tag } from './entities/tag.entity';
import { Op, where } from 'sequelize';
import { literal } from 'sequelize';

const dayjs = require('dayjs');
//import dayjs from 'dayjs' // ES 2015
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
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
        let quiz = await this.quizzesService.findOneByPostId(createPostDto.id);

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
    size = 3, // Ensure default size
    tags,
    cursor,
    search,
    status,
    postId,
  }: {
    userId?: string;
    size?: number;
    tags?: string;
    cursor?: string;
    search?: string;
    status?: string;
    postId?: string;
  }) {
    const whereClause: any = {
      status: status ? status.split(',') : Status.POSTED,
      visibility: PostVisibility.PUBLIC,
    };

    if (postId) {
      whereClause.id = postId;
    }

    if (cursor) {
      const parsedCursor = dayjs(cursor)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss.SSS');
      whereClause.createdAt = {
        [Op.lte]: literal(`'${parsedCursor}'`),
      };
    }

    const searchConditions: any = [];
    if (search) {
      searchConditions.push(
        literal(`"Post"."title" ILIKE '%${search}%'`),
        literal(
          `"Post"."user_id" IN (SELECT "id" FROM "users" WHERE "username" ILIKE '%${search}%')`,
        ),
        literal(
          `"Post"."id" IN (SELECT "post_id" FROM "post_tags" WHERE "tag_id" IN (SELECT "id" FROM "tags" WHERE "tag" ILIKE '%${search}%'))`,
        ),
      );
    }

    const posts = await this.postRepo.findAll({
      where: {
        ...whereClause,
        ...(search && { [Op.or]: searchConditions }),
      },
      attributes: [
        'id',
        'videoUrl',
        'thumbnailUrl',
        'title',
        'caption',
        'createdAt',
        'userId',
        'status',
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePictureUrl'],
          ...(userId && { where: { id: userId } }),
        },
        {
          model: Quiz,
          attributes: ['id'],
          where: { status: QuizStatus.ACTIVE },
          required: false,
        },
        {
          model: Tag,
          attributes: ['id', 'tag'],
          through: { attributes: [] },
          required: false,
          ...(tags && { where: { tag: tags.split(',') } }),
        },
      ],
      group: [
        'Post.id',
        'user.id', // Correct alias
        'quiz.id',
        'tags.id',
      ],
      order: [['createdAt', 'DESC']],
      limit: size || 3, // Ensure valid size
      subQuery: false,
    });

    return {
      posts,
      nextCursor:
        posts.length > 0
          ? posts[posts.length - 1].createdAt.toISOString()
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
        'userId',
        'status',
      ],
      include: [
        {
          model: User,
          attributes: ['username', 'profilePictureUrl'],
        },
        {
          model: Quiz,
          attributes: ['id'],
          required: false,
        },
        {
          model: Tag,
          attributes: ['id', 'tag'],
          required: false,
        },
      ],
    });
  }

  async findPostsByUserId({ userId, status }) {
    const whereClause: any = {
      status: status ? status.split(',') : Status.POSTED,
      userId: userId,
    };

    const posts = await this.postRepo.findAll({
      where: {
        ...whereClause,
      },
      attributes: [
        'id',
        'videoUrl',
        'thumbnailUrl',
        'title',
        'caption',
        'createdAt',
        'userId',
        'status',
      ],
      group: ['Post.id'],
      order: [['createdAt', 'DESC']],
      limit: 9,
      subQuery: false,
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
