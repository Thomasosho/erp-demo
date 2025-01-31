import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../database/entities/permission.entity';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      const permission = this.permissionRepository.create(createPermissionDto);
      return await this.permissionRepository.save(permission);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create permission',
        error.message,
      );
    }
  }

  async findByName(name: string): Promise<Permission> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { name },
      });
      return permission;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve permission by name',
        error.message,
      );
    }
  }

  async findAll(): Promise<Permission[]> {
    try {
      return await this.permissionRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve permissions',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<Permission> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
      });

      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      return permission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve permission',
        error.message,
      );
    }
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    try {
      const permission = await this.findOne(id);

      Object.assign(permission, updatePermissionDto);

      return await this.permissionRepository.save(permission);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update permission',
        error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const permission = await this.findOne(id);
      await this.permissionRepository.remove(permission);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete permission',
        error.message,
      );
    }
  }
}
