import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getModelToken } from '@nestjs/sequelize';
import { Post, PostVisibility, Status } from './entities/post.entity';
import { QuizzesService } from '../quizzes/quizzes.service';
import { User } from '../users/entities/user.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Tag } from './entities/tag.entity';
import Pagination from 'src/common/helpers/pagination';

@Injectable()
export class PostsService {
  constructor(
    @Inject(getModelToken(Post))
    private readonly postRepo: typeof Post,
    private readonly quizzesService: QuizzesService,
  ) {}

  async create(createPostDto: Partial<CreatePostDto>): Promise<Post> {
    const post = await this.postRepo.create({
      ...createPostDto,
      status: Status.DRAFT,
    });

    if (createPostDto.questions && createPostDto.questions.length > 0) {
      await this.quizzesService.createQuiz({
        postId: post.id,
        questions: createPostDto.questions,
      });

      return post;
    }
  }

  async findAll({
    userId,
    page,
    size,
    tags,
  }: {
    userId?: string;
    page?: number;
    size?: number;
    tags?: string;
  }) {
    const { limit, offset } = Pagination.getPagination(page, size);
    console.log('🚀 ~ PostsService ~ limit, offset:', limit, offset);
    const posts = await this.postRepo.findAndCountAll({
      where: { status: Status.POSTED, visibility: PostVisibility.PUBLIC },
      order: [['createdAt', 'DESC']],
      limit: limit || 3,
      offset: offset || 0,
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
          ...(tags && { where: { tag: tags.split(',') } }),
        },
      ],
    });

    const { totalItems, totalPages, currentPage, data } =
      Pagination.getPagingData(posts, page, limit);

    return { totalItems, totalPages, currentPage, data };
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async findPostsByUserId(userId: string) {
    const posts = await this.postRepo.findAll({
      where: {
        userId: userId,
        status: Status.POSTED,
        visibility: PostVisibility.PUBLIC,
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
