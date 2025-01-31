import {
  Controller,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/auth.dto';

@ApiTags('authentication')
@ApiBearerAuth()
@Controller('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 201,
    description: 'The user has successfully logged in.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
