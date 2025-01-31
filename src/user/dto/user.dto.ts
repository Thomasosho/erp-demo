import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  password: string;

  @ApiProperty({ example: [1, 2], description: 'Array of role IDs associated with the user', required: false })
  @IsArray()
  @IsOptional()
  roleIds?: number[];
}

export class UpdateUserDto extends CreateUserDto {}