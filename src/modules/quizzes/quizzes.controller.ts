import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAuthGuard } from 'src/common/auth/guards/jwt.auth.guard';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.createQuiz(createQuizDto);
  }

  @Post('/category')
  createQuestionCategory(@Body() { category }: { category: string }) {
    return this.quizzesService.createQuestionCategory(category);
  }

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get('/post/:id')
  @UseGuards(JwtAuthGuard)
  async findOneByPostId(@Param('id') id: string) {
    const quiz = await this.quizzesService.findOneByPostId(id);

    const mappedQuestions = quiz.questions.map((question) => ({
      id: question.id,
      displayTitle: question.displayTitle || '',
      title: question.title,
      type: question.questionCategory.type,

      options: question.options.map((option) => option.option),
      answer: question.answer.answer,
    }));

    return { ...quiz, questions: mappedQuestions };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(+id);
  }
}
