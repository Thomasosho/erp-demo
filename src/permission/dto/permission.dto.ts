import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'create:users', description: 'The name of the permission' })
  @IsString()
  name: string;
}

export class UpdatePermissionDto extends CreatePermissionDto {}