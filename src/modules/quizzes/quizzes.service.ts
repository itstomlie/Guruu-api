import { Inject, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { User } from '../users/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { Quiz } from './entities/quiz.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @Inject(getModelToken(User))
    private readonly userModel: typeof User,

    @Inject(getModelToken(Quiz))
    private readonly quizModel: typeof Quiz,
  ) {}

  create(createQuizDto: CreateQuizDto) {
    return this.quizModel.create(createQuizDto);
  }

  findAll() {
    return `This action returns all quizzes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quiz`;
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
