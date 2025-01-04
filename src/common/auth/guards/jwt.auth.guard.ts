import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
