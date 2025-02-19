import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('decoded user data', decoded);

      // Set the complete user object including permissions
      request.user = {
        id: decoded.sub,
        email: (decoded as jwt.JwtPayload).email,
        roles: (decoded as jwt.JwtPayload).roles,
        permissions: (decoded as jwt.JwtPayload).permissions,
      };

      return true;
    } catch (error) {
      return false;
    }
  }
}
