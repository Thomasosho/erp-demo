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
  import { PermissionGuard } from '../../guard/permission.guard';
  import { Permissions } from '../../common/decorators/permissions.decorator';
  import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
  import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
  import { RoleService } from '../service/role.service';
  
  @ApiTags('roles')
  @ApiBearerAuth()
  @Controller('roles')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  export class RoleController {
    constructor(private readonly roleService: RoleService) {}
  
    @Post()
    @Permissions('create:roles')
    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(@Body() createRoleDto: CreateRoleDto) {
      return this.roleService.create(createRoleDto);
    }
  
    @Get()
    @Permissions('read:roles')
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'Return all roles.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    findAll() {
      return this.roleService.findAll();
    }
  
    @Get(':id')
    @Permissions('read:roles')
    @ApiOperation({ summary: 'Get a role by ID' })
    @ApiResponse({ status: 200, description: 'Return the role.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    findOne(@Param('id') id: string) {
      return this.roleService.findOne(+id);
    }
  
    @Put(':id')
    @Permissions('update:roles')
    @ApiOperation({ summary: 'Update a role by ID' })
    @ApiResponse({ status: 200, description: 'The role has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
      return this.roleService.update(+id, updateRoleDto);
    }
  
    @Delete(':id')
    @Permissions('delete:roles')
    @ApiOperation({ summary: 'Delete a role by ID' })
    @ApiResponse({ status: 200, description: 'The role has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    remove(@Param('id') id: string) {
      return this.roleService.remove(+id);
    }
  }