import { IExtendedUser } from './../../common/interfaces/request';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageClient } from '@supabase/storage-js';
import { exec } from 'node:child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import * as util from 'node:util';
import * as crypto from 'crypto';

const execPromise = util.promisify(exec);

@Injectable()
export class VideosService {
  private storageClient: StorageClient;

  constructor(private readonly configService: ConfigService) {
    const serviceKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
    const storageUrl = this.configService.get('SUPABASE_STORAGE_URL');
    this.storageClient = new StorageClient(storageUrl, {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    });
  }

  // async upload(file: Express.Multer.File, user: IExtendedUser) {
  //   const videoId = file.originalname;
  //   const dirPath = `${user.sub}/${videoId}`;

  //   const hls = await this.convertMp4ToHls(file.buffer);
  //   const { data, error } = await this.storageClient
  //     .from('videos_hls')
  //     .upload(path.join(dirPath, `${videoId + '.m3u8'}`), hls.playlist, {
  //       contentType: 'application/vnd.apple.mpegurl',
  //     });

  //   if (error) {
  //     console.log('🚀 ~ VideosService ~ upload ~ error:', error);
  //     throw error;
  //   }

  //   await Promise.all(
  //     hls.segments.map((segment, i) =>
  //       this.storageClient
  //         .from('videos_hls')
  //         .upload(path.join(dirPath, `playlist${i.toString()}.ts`), segment, {
  //           contentType: 'video/MP2T',
  //         }),
  //     ),
  //   );

  //   const fullPath = data.fullPath;

  //   return {
  //     statusCode: 200,
  //     message: 'Video uploaded successfully',
  //     data: {
  //       fullPath,
  //     },
  //   };
  // }

  async upload({ playlist, segments, videoId, userId }) {
    const dirPath = `${userId}/${videoId}`;

    const { data, error } = await this.storageClient
      .from('videos_hls')
      .upload(path.join(dirPath, `${videoId + '.m3u8'}`), playlist, {
        contentType: 'application/vnd.apple.mpegurl',
      });

    if (error) {
      console.log('🚀 ~ VideosService ~ upload ~ error:', error);
      throw error;
    }

    await Promise.all(
      segments.map((segment, i) =>
        this.storageClient
          .from('videos_hls')
          .upload(path.join(dirPath, `playlist${i.toString()}.ts`), segment, {
            contentType: 'video/MP2T',
          }),
      ),
    );

    const fullPath = data.fullPath;

    return {
      statusCode: 200,
      message: 'Video uploaded successfully',
      data: {
        fullPath,
      },
    };
  }

  async convertMp4ToHls(
    inputBuffer: Buffer,
  ): Promise<{ playlist: Buffer; segments: Buffer[] }> {
    const id = crypto.randomUUID();
    const tmpFolder = path.join(process.cwd(), '.tmp', id);
    const tmpInputPath = path.join(tmpFolder, 'input');
    const tmpOutputFolderPath = path.join(tmpFolder, 'output');
    const tmpPlaylistPath = path.join(tmpOutputFolderPath, 'playlist.m3u8');

    try {
      await mkdir(tmpOutputFolderPath, { recursive: true });
      await writeFile(tmpInputPath, inputBuffer);

      await execPromise(
        `ffmpeg -i ${tmpInputPath} -hls_time 10 -hls_list_size 0 -hls_segment_type mpegts -f hls ${tmpPlaylistPath}`,
      );

      const playlist = await readFile(tmpPlaylistPath);
      const segments = [];
      const files = await readdir(tmpOutputFolderPath);

      for (const file of files) {
        if (file === 'playlist.m3u8') continue;
        segments.push(await readFile(path.join(tmpOutputFolderPath, file)));
      }

      return { playlist, segments };
    } catch (error) {
      throw error;
    } finally {
      await rm(tmpFolder, { recursive: true, force: true });
    }
  }
}
