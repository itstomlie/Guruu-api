import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './common/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './modules/posts/entities/post.entity';
import { User } from './modules/users/user.entity';
import { Quiz } from './modules/quizzes/entities/quiz.entity';
import { QuestionCategory } from './modules/quizzes/entities/questionCategory.entity';
import { Question } from './modules/quizzes/entities/question.entity';
import { Option } from './modules/quizzes/entities/option.entity';
import { Answer } from './modules/quizzes/entities/answer.entity';

@Module({
  imports: [
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
        models: [User, Post, Quiz, QuestionCategory, Question, Option, Answer],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
