import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'The name of the role' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Administrator role with full permissions', description: 'The description of the role', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: [1, 2, 3], description: 'Array of permission IDs associated with the role', required: false })
  @IsArray()
  @IsOptional()
  permissionIds?: number[];
}

export class UpdateRoleDto extends CreateRoleDto {}
