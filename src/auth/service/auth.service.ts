import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { UserService } from '../../user/service/user.service';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(user: User): Promise<string> {
    const permissions = user.roles.reduce((acc, role) => {
      role.permissions.forEach((permission) => {
        acc.add(permission.name);
      });
      return acc;
    }, new Set<string>());

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: Array.from(permissions),
    };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const email = loginDto.email.toLowerCase();
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['roles', 'roles.permissions'],
      });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const token = await this.generateToken(user);

      const userResponse = { ...user };
      delete userResponse.password;

      return { token, user: userResponse };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
