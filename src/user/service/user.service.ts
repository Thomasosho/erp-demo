import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        email: createUserDto.email.toLowerCase(),
      });

      if (createUserDto.roleIds) {
        const roles = await this.roleRepository.findByIds(
          createUserDto.roleIds,
        );
        user.roles = roles;
      }

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create user',
        error.message,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({ relations: ['roles'] });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve users',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve user',
        error.message,
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['roles'],
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve user by email',
        error.message,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      Object.assign(user, updateUserDto);

      if (updateUserDto.roleIds) {
        const roles = await this.roleRepository.findByIds(
          updateUserDto.roleIds,
        );
        user.roles = roles;
      }

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update user',
        error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete user',
        error.message,
      );
    }
  }
}
