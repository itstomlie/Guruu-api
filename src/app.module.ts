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
import { Waitlist } from './modules/users/entities/waitlist.entity';
import { PostTag } from './modules/posts/entities/postTag.entity';
import { Tag } from './modules/posts/entities/tag.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'videos'),
      serveRoot: '/videos',
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
          Waitlist,
          Tag,
          PostTag,
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
