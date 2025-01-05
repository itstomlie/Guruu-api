import { PostTag } from './entities/postTag.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { getModelToken } from '@nestjs/sequelize';
import { Tag } from './entities/tag.entity';
import { AssociateTagsDto } from './dto/associate-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @Inject(getModelToken(Tag))
    private readonly tagRepo: typeof Tag,

    @Inject(getModelToken(PostTag))
    private readonly postTagRepo: typeof PostTag,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.tagRepo.findOne({
      where: { tag: createTagDto.tag },
    });

    if (tag) throw new HttpException('Tag already exists', HttpStatus.CONFLICT);

    return await this.tagRepo.create({
      tag: createTagDto.tag,
    });
  }

  async findAll({ tag }: { tag?: string }) {
    return this.tagRepo.findAll({
      ...(tag && { where: { tag: tag } }),
      attributes: ['id', 'tag'],
    });
  }

  async findOne(id: string) {
    return this.tagRepo.findOne({
      where: { id },
      attributes: ['id', 'tag'],
    });
  }

  async associateTags({ postId, tags }: AssociateTagsDto) {
    const tagsArr = tags.map((tag) => tag.tag);

    const tagIds = await this.tagRepo.findAll({
      where: { tag: tagsArr },
    });

    await Promise.all(
      tagIds.map((tag) =>
        this.postTagRepo.create({
          postId: postId,
          tagId: tag.id,
        }),
      ),
    );
    return 'Successfully associated tags';
  }
}
