import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { AssociateTagsDto } from './dto/associate-tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(@Query('tag') tag: string) {
    return this.tagsService.findAll({ tag });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Post('/posts')
  associateTags(@Body() associateTagsDto: AssociateTagsDto) {
    return this.tagsService.associateTags(associateTagsDto);
  }
}
