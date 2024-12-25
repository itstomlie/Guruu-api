import { Inject, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { User } from '../users/entities/user.entity';
import { getModelToken, InjectModel } from '@nestjs/sequelize';
import { Quiz, QuizStatus } from './entities/quiz.entity';
import { QuestionCategory } from './entities/questionCategory.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { Option } from './entities/option.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz) private quizRepo: typeof Quiz,
    @InjectModel(QuestionCategory)
    private questionCategoryRepo: typeof QuestionCategory,
    @InjectModel(Question) private questionRepo: typeof Question,
    @InjectModel(Answer) private answerRepo: typeof Answer,
    @InjectModel(Option) private optionRepo: typeof Option,
  ) {}

  async createQuiz(createQuizDto: Partial<CreateQuizDto>) {
    try {
      console.log(
        '🚀 ~ QuizzesService ~ createQuizDto.questions.forEach ~ createQuizDto.questions:',
        createQuizDto.questions,
      );

      const quiz = await this.quizRepo.create(createQuizDto);
      console.log('🚀 ~ QuizzesService ~ createQuiz ~ quiz:', quiz);

      createQuizDto.questions.forEach(async (q) => {
        const category = await this.questionCategoryRepo.findOne({
          where: {
            type: q.type,
          },
        });

        const question = await this.questionRepo.create({
          quizId: quiz.id,
          categoryId: category.id,
          title: q.title,
        });

        if (q.type !== 'true-false') {
          q.options.forEach(async (o) => {
            this.optionRepo.create({
              questionId: question.id,
              option: o,
            });
          });
        }

        this.answerRepo.create({
          questionId: question.id,
          answer: q.answer,
        });
      });

      //  questions: [
      //     {
      //       id: '',
      //       title: 'whatt?',
      //       type: 'multiple-choice',
      //       options: [Array],
      //       answer: 'best'
      //     }
      //   ]

      return 'Create Quiz Success';
    } catch (error) {
      console.log('🚀 ~ QuizzesService ~ createQuiz ~ error:', error);
    }
  }

  createQuestionCategory(category: string) {
    return this.questionCategoryRepo.create({ type: category });
  }

  findAll() {
    return `This action returns all quizzes`;
  }

  async findOneByPostId(id: string) {
    const quiz = await this.quizRepo.findOne({
      where: {
        postId: id,
        status: QuizStatus.ACTIVE,
      },
      attributes: ['id', 'title', 'description'],
      include: [
        {
          model: Question,
          attributes: ['id', 'displayTitle', 'title'],
          include: [
            {
              model: QuestionCategory,
              attributes: ['type'],
            },
            {
              model: Option,
              attributes: ['option', 'createdAt'],
            },
            {
              model: Answer,
              attributes: ['answer'],
            },
          ],
        },
      ],
    });

    return quiz?.toJSON();
  }

  async update(id: string, updateQuizDto: Partial<UpdateQuizDto>) {
    const quiz = await this.quizRepo.update(updateQuizDto, {
      where: { id },
      returning: true,
    });
    console.log('🚀 ~ QuizzesService ~ update ~ quiz:', quiz);

    return quiz[1];
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
