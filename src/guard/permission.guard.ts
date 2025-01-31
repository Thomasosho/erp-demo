import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);
  
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    
    console.log('Required permissions:', requiredPermissions);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    console.log('User from request:', user);

    if (!user || !user.roles) {
      console.log('No user or roles found');
      return false;
    }

    const userPermissions = new Set<string>();
    if (Array.isArray(user.permissions)) {
      user.permissions.forEach((permission: string) => userPermissions.add(permission));
    }
    
    console.log('User permissions:', Array.from(userPermissions));

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );
    
    console.log('Has required permissions:', hasPermission);
    
    return hasPermission;
  }
}