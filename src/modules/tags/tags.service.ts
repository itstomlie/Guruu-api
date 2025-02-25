import { PostTag } from './entities/postTag.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { getModelToken } from '@nestjs/sequelize';
import { Tag } from './entities/tag.entity';
import { AssociateTagsDto } from './dto/associate-tags.dto';
import { Post, Status } from '../posts/entities/post.entity';
import { VideosService } from '../videos/videos.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TagsService {
  constructor(
    @Inject(getModelToken(Tag))
    private readonly tagRepo: typeof Tag,

    @Inject(getModelToken(PostTag))
    private readonly postTagRepo: typeof PostTag,

    @Inject(getModelToken(Post))
    private readonly postRepo: typeof Post,

    private readonly videosService: VideosService,
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
    try {
      const tagsArr = tags.map((tag) => tag.tag);

      const tagIds = await this.tagRepo.findAll({
        where: { tag: tagsArr },
      });

      if (tagIds.length === 0) {
        throw new HttpException('Tags not found', HttpStatus.NOT_FOUND);
      }

      await this.postTagRepo.bulkCreate(
        tagIds.map((tag) => ({
          postId,
          tagId: tag.id,
        })),
      );

      const post = await this.postRepo.findOne({
        where: { id: postId },
        include: [
          {
            model: User,
            attributes: ['id'],
          },
        ],
      });

      if (!post || !post.videoUrl) {
        throw new Error('Post or video URL not found');
      }

      const match = post.videoUrl.match(/\/([^/]+)\.mp4$/);
      const videoId = match ? match[1] : null;

      const videoUrl =
        process.env.SUPABASE_STORAGE_URL + '/object/public/' + post.videoUrl;
      console.log('🚀 ~ TagsService ~ associateTags ~ videoUrl:', videoUrl);

      const videoResponse = await fetch(videoUrl);
      console.log(
        '🚀 ~ TagsService ~ associateTags ~ videoResponse:',
        videoResponse,
      );
      if (!videoResponse.ok) {
        throw new Error('Failed to download the video');
      }
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

      const { playlist, segments } =
        await this.videosService.convertMp4ToHls(videoBuffer);

      const uploadResult = await this.videosService.upload({
        playlist,
        segments,
        videoId,
        userId: post.user.id,
      });

      await this.postRepo.update(
        {
          videoUrl: uploadResult.data.fullPath,
          status: Status.POSTED,
        },
        {
          where: {
            id: postId,
          },
        },
      );

      return 'Successfully associated tags and processed video';
    } catch (error) {
      console.log('🚀 ~ TagsService ~ associateTags ~ error:', error);
      throw error;
    }
  }
}
