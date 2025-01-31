import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PermissionService } from '../service/permission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '../../database/entities/permission.entity';
import { Repository } from 'typeorm';

describe('PermissionService', () => {
  let service: PermissionService;
  let permissionRepository: Repository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    permissionRepository = module.get<Repository<Permission>>(getRepositoryToken(Permission));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save the permission', async () => {
      const createPermissionDto = {
        name: 'create:users',
        description: 'Can create users',
      };

      jest.spyOn(permissionRepository, 'save').mockResolvedValue({
        ...createPermissionDto,
        id: 1,
        roles: [],
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null,
      } as Permission);

      const result = await service.create(createPermissionDto);

      expect(result.name).toEqual(createPermissionDto.name);
      expect(permissionRepository.save).toHaveBeenCalledWith(createPermissionDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const permissions = [
        { id: 1, name: 'create:users'},
        { id: 2, name: 'read:users', description: 'Can read users' },
      ] as Permission[];

      jest.spyOn(permissionRepository, 'find').mockResolvedValue(permissions);

      const result = await service.findAll();

      expect(result).toEqual(permissions);
    });
  });

  describe('findOne', () => {
    it('should return a permission by ID', async () => {
      const permission = { 
        id: 1, 
        name: 'create:users', 
        description: 'Can create users', 
        roles: [], 
        updatedAt: new Date(), 
        createdAt: new Date(), 
        deletedAt: null 
      } as Permission;

      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(permission);

      const result = await service.findOne(1);

      expect(result).toEqual(permission);
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a permission by name', async () => {
      const permission = { 
        id: 1, 
        name: 'create:users', 
        description: 'Can create users', 
        roles: [], 
        updatedAt: new Date(), 
        createdAt: new Date(), 
        deletedAt: null 
      } as Permission;

      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(permission);

      const result = await service.findByName('create:users');

      expect(result).toEqual(permission);
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const updatePermissionDto = {
        name: 'update:users',
        description: 'Can update users',
      };

      const permission = { 
        id: 1, 
        name: 'create:users', 
        description: 'Can create users', 
        roles: [], 
        updatedAt: new Date(), 
        createdAt: new Date(), 
        deletedAt: null 
      } as Permission;

      jest.spyOn(service, 'findOne').mockResolvedValue(permission);
      jest.spyOn(permissionRepository, 'save').mockResolvedValue({
        ...permission,
        ...updatePermissionDto,
      });

      const result = await service.update(1, updatePermissionDto);

      expect(result.name).toEqual(updatePermissionDto.name);
      expect(permissionRepository.save).toHaveBeenCalledWith({
        ...permission,
        ...updatePermissionDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      const permission = { 
        id: 1, 
        name: 'create:users', 
        description: 'Can create users', 
        roles: [], 
        updatedAt: new Date(), 
        createdAt: new Date(), 
        deletedAt: null 
      } as Permission;

      jest.spyOn(service, 'findOne').mockResolvedValue(permission);
      jest.spyOn(permissionRepository, 'remove').mockResolvedValue(permission);

      await service.remove(1);

      expect(permissionRepository.remove).toHaveBeenCalledWith(permission);
    });
  });
});