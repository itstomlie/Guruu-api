import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './common/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './modules/posts/entities/post.entity';
import { User } from './modules/users/entities/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  Quiz,
  QuestionCategory,
  Question,
  Option,
  Answer,
} from './modules/quizzes/entities/index.entity';
import { Character } from './modules/users/entities/character.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VideosModule } from './modules/videos/videos.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'videos'),
      serveRoot: '/videos', // This sets the route where the files will be accessible
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('SUPABASE_HOST'),
        port: configService.get<number>('SUPABASE_PORT'),
        username: configService.get<string>('SUPABASE_USERNAME'),
        password: configService.get<string>('SUPABASE_PASSWORD'),
        database: 'postgres',
        models: [
          User,
          Post,
          Quiz,
          QuestionCategory,
          Question,
          Option,
          Answer,
          Character,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PostsModule,
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
