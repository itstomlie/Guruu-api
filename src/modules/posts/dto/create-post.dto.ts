import { PostVisibility, Status } from '../entities/post.entity';

interface Question {
  title: string;
  type: string;
  options: string[];
  answer: string;
}

export class CreatePostDto {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  caption: string;
  visibility: PostVisibility;
  status: Status;
  questions: Question[];
}
