import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { ConfigModule } from '@nestjs/config';
import { VideosService } from './videos.service';

@Module({
  imports: [ConfigModule],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
