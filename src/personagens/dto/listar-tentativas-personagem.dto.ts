import { OmitType } from '@nestjs/swagger';
import { FindTentativasQueryDto } from '../../tentativas_sala/dto/find-tentativas-query.dto.js';

export class ListarTentativasPersonagemDto extends OmitType(
  FindTentativasQueryDto,
  ['personagem_id'] as const,
) {}
