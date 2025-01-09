import {
  Controller,
  Get,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @UseInterceptors(FileInterceptor('file'))
  async test(@UploadedFile() file: Express.Multer.File) {
    return await this.videosService.asd(file);
  }

  @Get(':filename')
  async getVideo(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'public', 'videos', filename);
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  }
}

// "build": "nest build && copyfiles -u 1 src/common/public/**/* dist/public",
// "start": "nest build && copyfiles -u 1 src/common/public/**/* dist/public && nest start",
// "start:dev": "nest start --watch",
