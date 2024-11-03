import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getModelToken } from '@nestjs/sequelize';
import { Post, PostVisibility, Status } from './entities/post.entity';
import { QuizzesService } from '../quizzes/quizzes.service';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Question } from '../quizzes/entities/question.entity';
import { Answer } from '../quizzes/entities/answer.entity';
import { Option } from '../quizzes/entities/option.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(getModelToken(Post))
    private readonly postRepo: typeof Post,
    private readonly quizzesService: QuizzesService,
  ) {}

  async create(createPostDto: Partial<CreatePostDto>): Promise<Post> {
    const post = await this.postRepo.create(createPostDto);

    await this.quizzesService.createQuiz({
      postId: post.id,
      questions: createPostDto.questions,
    });

    return post;
  }

  async findAll({ lean }) {
    if (lean) {
      const posts = await this.postRepo.findAll({
        where: [
          { status: Status.POSTED },
          { visibility: PostVisibility.PUBLIC },
        ],
        order: [['createdAt', 'DESC']],
        attributes: [
          'id',
          'videoUrl',
          'thumbnailUrl',
          'title',
          'caption',
          'createdAt',
        ],
        include: [{ model: User, attributes: ['username'] }],
      });

      return posts;
    }

    return this.postRepo.findAll({
      where: { status: Status.POSTED },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username'] }],
    });
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
