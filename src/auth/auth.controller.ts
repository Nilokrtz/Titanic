import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { RegistrarRespostaDto } from './dto/registrar-resposta.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Cadastra um aluno' })
  @ApiCreatedResponse({ type: RegistrarRespostaDto })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou campo não permitido.',
  })
  @ApiConflictResponse({ description: 'Email já cadastrado.' })
  registrar(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    registro: RegistrarDto,
  ): Promise<RegistrarRespostaDto> {
    return this.authService.registrar(registro);
  }
}
