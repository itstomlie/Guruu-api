import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageClient } from '@supabase/storage-js';
import { exec } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import * as util from 'node:util';

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

  async asd(file: Express.Multer.File) {
    const dirPath = file.originalname;
    const hls = await this.convertMp4ToHls(file.buffer);
    const playlistFile = await this.storageClient
      .from('videos_hls')
      .upload(
        path.join(dirPath, file.originalname.split('.').slice(0, -1) + '.m3u8'),
        hls.playlist,
        { contentType: 'application/vnd.apple.mpegurl' },
      );

    await Promise.all(
      hls.segments.map((segment, i) =>
        this.storageClient
          .from('videos_hls')
          .upload(path.join(dirPath, `playlist${i.toString()}.ts`), segment, {
            contentType: 'video/MP2T',
          }),
      ),
    );

    return true;
  }

  async convertMp4ToHls(
    inputBuffer: Buffer,
  ): Promise<{ playlist: Buffer; segments: Buffer[] }> {
    return new Promise(async (resolve, reject) => {
      const id = crypto.randomUUID();
      const tmpFolder = path.join(process.cwd(), '.tmp', id);
      const tmpInputPath = path.join(tmpFolder, 'input');
      const tmpOutputFolderPath = path.join(tmpFolder, 'output');
      const tmpPlaylistPath = path.join(tmpOutputFolderPath, 'playlist.m3u8');
      console.log(tmpFolder);
      await mkdir(tmpOutputFolderPath, { recursive: true });
      await writeFile(tmpInputPath, inputBuffer);
      await execPromise(
        `ffmpeg -i ${tmpInputPath} -hls_time 10 -hls_list_size 0 -hls_segment_type mpegts -f hls ${tmpPlaylistPath}`,
      );
      const playlist = await readFile(tmpPlaylistPath);
      const segments = [];
      const files = await readdir(tmpOutputFolderPath);
      for (const file of files) {
        if (file == 'playlist.m3u8') continue;
        segments.push(await readFile(path.join(tmpOutputFolderPath, file)));
      }
      resolve({ playlist, segments });
    });
  }
}
