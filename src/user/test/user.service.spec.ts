import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash the password and save the user', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roleIds: [1],
        name: 'Test User',
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...createUserDto,
        id: 1,
        password: hashedPassword,
        name: 'Test User',
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as User);

      const result = await service.create(createUserDto);

      expect(result.password).toEqual(hashedPassword);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
        email: createUserDto.email.toLowerCase(),
      });
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roleIds: [1],
        name: 'Test User',
      };

      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Failed to create user'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        new InternalServerErrorException('Failed to create user', 'Failed to create user')
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, name: 'testuser1', email: 'test1@example.com', roles: [] },
        { id: 2, name: 'testuser2', email: 'test2@example.com', roles: [] },
      ] as User[];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, name: 'testuser', email: 'test@example.com', roles: [] } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, name: 'testuser', email: 'test@example.com', roles: [] } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        name: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword123',
        roleIds: [1],
      };

      const user = { id: 1, name: 'testuser', email: 'test@example.com', roles: [] } as User;
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...user,
        ...updateUserDto,
        password: hashedPassword,
      });

      const result = await service.update(1, updateUserDto);

      expect(result.password).toEqual(hashedPassword);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        ...updateUserDto,
        password: hashedPassword,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: 1, name: 'testuser', email: 'test@example.com', roles: [] } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(user);

      await service.remove(1);

      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });
  });
});