import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserController } from './user/controller/user.controller';
import { UserService } from './user/service/user.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { PermissionGuard } from './guard/permission.guard';
import { User } from './database/entities/user.entity';
import { Role } from './database/entities/role.entity';
import { Permission } from './database/entities/permission.entity';
import { RoleController } from './role/controller/role.controller';
import { PermissionController } from './permission/controller/permission.controller';
import { PermissionService } from './permission/service/permission.service';
import { RoleService } from './role/service/role.service';
import { AuthController } from './auth/controller/auth.controller';
import { AuthService } from './auth/service/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, UserController, RoleController, PermissionController, AuthController],
  providers: [AppService, UserService, RoleService, PermissionService, AuthService, JwtAuthGuard, PermissionGuard],
})
export class AppModule {}