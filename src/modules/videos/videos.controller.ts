import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/auth/guards/jwt.auth.guard';
import { IExtendedRequest } from 'src/common/interfaces/request';

@Controller('upload')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(JwtAuthGuard)
  // async upload(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Req() req: IExtendedRequest,
  // ) {
  //   const user = req.user;
  //   return await this.videosService.upload(file, user);
  // }

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
