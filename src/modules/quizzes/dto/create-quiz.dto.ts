import { QuizStatus } from '../entities/quiz.entity';

export class CreateQuizDto {
  postId: string;
  title?: string;
  description?: string;
  questions: any[];
  status: QuizStatus.ACTIVE | QuizStatus.INACTIVE;
}
