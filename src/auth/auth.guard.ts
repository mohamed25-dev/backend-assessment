import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {}
    
    canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const token = request.headers['authorization'];
    return token === this.configService.get('ACCESS_TOKEN');
  }
}


