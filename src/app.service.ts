import { Dependencies, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  status(): { success: boolean; message: string; data: any } {
    return {
      success: true,
      message: 'Server is running..',
      data: {},
    };
  }
}
