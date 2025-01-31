import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UserService } from './user/service/user.service';
import { CreateUserDto, UpdateUserDto } from './user/dto/user.dto';
import { RoleService } from './role/service/role.service';
import { PermissionService } from './permission/service/permission.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  async onModuleInit() {
    await this.createSuperAdmin();
  }

  getHello(): string {
    return 'Hello World, I am running perfectly!';
  }

  private async createSuperAdmin() {
    try {
      const permissionsList = [
        { name: 'create:users', description: 'Can create users' },
        { name: 'read:users', description: 'Can read users' },
        { name: 'update:users', description: 'Can update users' },
        { name: 'delete:users', description: 'Can delete users' },
        { name: 'create:roles', description: 'Can create roles' },
        { name: 'read:roles', description: 'Can read roles' },
        { name: 'update:roles', description: 'Can update roles' },
        { name: 'delete:roles', description: 'Can delete roles' },
        { name: 'create:permissions', description: 'Can create permissions' },
        { name: 'read:permissions', description: 'Can read permissions' },
        { name: 'update:permissions', description: 'Can update permissions' },
        { name: 'delete:permissions', description: 'Can delete permissions' },
      ];

      const createdPermissions = [];
      for (const perm of permissionsList) {
        let permission = await this.permissionService.findByName(perm.name);
        if (!permission) {
          permission = await this.permissionService.create(perm);
          this.logger.log(`Permission ${perm.name} created`);
        }
        createdPermissions.push(permission.id);
      }

      let superAdminRole = await this.roleService.findByName('SuperAdmin');
      if (!superAdminRole) {
        superAdminRole = await this.roleService.create({
          name: 'SuperAdmin',
          description: 'Super Admin role with full permissions',
          permissionIds: createdPermissions,
        });
        this.logger.log('Super admin role created successfully');
      } else {
        superAdminRole = await this.roleService.update(superAdminRole.id, {
          name: superAdminRole.name,
          permissionIds: createdPermissions,
        });
        this.logger.log('Super admin role updated successfully');
      }

      const superAdminEmail = 'superadmin@example.com';
      let existingUser = await this.userService.findByEmail(superAdminEmail);

      if (!existingUser) {
        const superAdminUser: CreateUserDto = {
          name: 'super admin',
          email: superAdminEmail,
          password: '12345678',
          roleIds: [superAdminRole.id],
        };

        await this.userService.create(superAdminUser);
        this.logger.log('Super admin user created successfully');
      } else {
        await this.userService.update(existingUser.id, {
          roleIds: [superAdminRole.id],
        } as UpdateUserDto);
        this.logger.log('Super admin user updated successfully');
      }
    } catch (error) {
      this.logger.error('Failed to create super admin setup', error.stack);
    }
  }
}
