import { Inject, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { User } from '../users/entities/user.entity';
import { getModelToken, InjectModel } from '@nestjs/sequelize';
import { Quiz } from './entities/quiz.entity';
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
    const quiz = await this.quizRepo.create(createQuizDto);

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
  }

  createQuestionCategory(category: string) {
    return this.questionCategoryRepo.create({ type: category });
  }

  findAll() {
    return `This action returns all quizzes`;
  }

  findOneByPostId(id: string) {
    return this.quizRepo.findOne({
      where: {
        postId: id,
      },
      attributes: ['id', 'title', 'description'],
      include: {
        model: Question,
        attributes: ['id', 'displayTitle', 'title'],
        include: [
          {
            model: QuestionCategory,
            attributes: ['type'],
          },
          {
            model: Option,
            attributes: ['option'],
          },
          {
            model: Answer,
            attributes: ['answer'],
          },
        ],
      },
    });
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
