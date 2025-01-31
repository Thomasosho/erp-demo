import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../database/entities/role.entity';
import { Permission } from '../../database/entities/permission.entity';
import { Repository } from 'typeorm';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Permission),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepository = module.get<Repository<Permission>>(getRepositoryToken(Permission));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save the role with permissions', async () => {
      const createRoleDto = {
        name: 'Admin',
        description: 'Administrator role',
        permissionIds: [1, 2],
      };

      jest.spyOn(permissionRepository, 'findByIds').mockResolvedValue([
        { id: 1, name: 'create:users' } as Permission,
        { id: 2, name: 'read:users' } as Permission,
      ]);
      jest.spyOn(roleRepository, 'save').mockResolvedValue({
        ...createRoleDto,
        id: 1,
        permissions: [
          { id: 1, name: 'create:users', roles: [], createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
          { id: 2, name: 'read:users', roles: [], createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as Role);

      const result = await service.create(createRoleDto);

      expect(result.permissions).toHaveLength(2);
      expect(roleRepository.save).toHaveBeenCalledWith({
        ...createRoleDto,
        permissions: [
          { id: 1, name: 'create:users', roles: [], createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
          { id: 2, name: 'read:users', roles: [], createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
        ],
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles = [
        { id: 1, name: 'Admin', permissions: [] },
        { id: 2, name: 'User', permissions: [] },
      ] as Role[];

      jest.spyOn(roleRepository, 'find').mockResolvedValue(roles);

      const result = await service.findAll();

      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should return a role by ID', async () => {
      const role = { id: 1, name: 'Admin', permissions: [] } as Role;

      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(role);

      const result = await service.findOne(1);

      expect(result).toEqual(role);
    });

    it('should throw NotFoundException if role not found', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      const role = { id: 1, name: 'Admin', permissions: [] } as Role;

      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(role);

      const result = await service.findByName('Admin');

      expect(result).toEqual(role);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateRoleDto = {
        name: 'UpdatedAdmin',
        description: 'Updated description',
        permissionIds: [1, 2],
      };

      const role = { id: 1, name: 'Admin', permissions: [] } as Role;

      jest.spyOn(service, 'findOne').mockResolvedValue(role);
      jest.spyOn(permissionRepository, 'findByIds').mockResolvedValue([
        { id: 1, name: 'create:users' } as Permission,
        { id: 2, name: 'read:users' } as Permission,
      ]);
      jest.spyOn(roleRepository, 'save').mockResolvedValue({
        ...role,
        ...updateRoleDto,
        permissions: [
          { id: 1, name: 'create:users', roles: [], createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
          { id: 2, name: 'read:users', roles: [], createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
        ],
      });

      const result = await service.update(1, updateRoleDto);

      expect(result.permissions).toHaveLength(2);
      expect(roleRepository.save).toHaveBeenCalledWith({
        ...role,
        ...updateRoleDto,
        permissions: [
          { id: 1, name: 'create:users' },
          { id: 2, name: 'read:users' },
        ],
      });
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const role = { id: 1, name: 'Admin', permissions: [] } as Role;

      jest.spyOn(service, 'findOne').mockResolvedValue(role);
      jest.spyOn(roleRepository, 'remove').mockResolvedValue(role);

      await service.remove(1);

      expect(roleRepository.remove).toHaveBeenCalledWith(role);
    });
  });
});