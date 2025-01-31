import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from '../service/permission.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { PermissionGuard } from '../../guard/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Permissions('create:permissions')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'The permission has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @Permissions('read:permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Return all permissions.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Permissions('read:permissions')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiResponse({ status: 200, description: 'Return the permission.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Put(':id')
  @Permissions('update:permissions')
  @ApiOperation({ summary: 'Update a permission by ID' })
  @ApiResponse({ status: 200, description: 'The permission has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions('delete:permissions')
  @ApiOperation({ summary: 'Delete a permission by ID' })
  @ApiResponse({ status: 200, description: 'The permission has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
