import { PostVisibility, Status } from '../entities/post.entity';

interface Question {
  question: string;
  type: string;
  options: string[];
  answer: string;
}

export class CreatePostDto {
  userId: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  caption: string;
  visibility: PostVisibility;
  status: Status;
  questions: Question[];
}
