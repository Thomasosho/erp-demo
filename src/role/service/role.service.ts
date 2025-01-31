import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../database/entities/role.entity';
import { Permission } from '../../database/entities/permission.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.roleRepository.create(createRoleDto);

      if (createRoleDto.permissionIds) {
        const permissions = await this.permissionRepository.findByIds(
          createRoleDto.permissionIds,
        );
        role.permissions = permissions;
      }

      return await this.roleRepository.save(role);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create role',
        error.message,
      );
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.roleRepository.find({ relations: ['permissions'] });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve roles',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions'],
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve role',
        error.message,
      );
    }
  }

  async findByName(name: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { name },
        relations: ['permissions'],
      });

      return role;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve role by name', error.message);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(id);

      Object.assign(role, updateRoleDto);

      if (updateRoleDto.permissionIds) {
        const permissions = await this.permissionRepository.findByIds(
          updateRoleDto.permissionIds,
        );
        role.permissions = permissions;
      }

      return await this.roleRepository.save(role);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update role',
        error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const role = await this.findOne(id);
      await this.roleRepository.remove(role);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete role',
        error.message,
      );
    }
  }
}
