import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
      example: 'john.doe@example.com',
      description: 'The email address used during registration',
      required: true
    })
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      example: 'Pass123!@#',
      description: 'User password',
      required: true
    })
    password: string;
  }