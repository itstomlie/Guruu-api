import { Dependencies, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from './modules/users/user.model';

@Dependencies(Sequelize)
@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {
    this.sequelize.addModels([User]);
  }

  status(): { success: boolean; message: string; data: any } {
    return {
      success: true,
      message: 'Server is running',
      data: {},
    };
  }
}
