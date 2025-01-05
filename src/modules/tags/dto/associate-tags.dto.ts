import { Tag } from '../entities/tag.entity';

export class AssociateTagsDto {
  postId: string;
  tags: Tag[];
}
