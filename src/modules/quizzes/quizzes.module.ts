import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { QuestionCategory } from './entities/questionCategory.entity';
import { Option } from './entities/option.entity';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Quiz,
      QuestionCategory,
      Question,
      Option,
      Answer,
    ]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
