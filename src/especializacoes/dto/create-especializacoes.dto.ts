import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {tipo_especializacao, tipo_topico_questao} from "../../generated/prisma/client.js";

export class CreateEspecializacoeDto {
    @ApiProperty({
        enum: tipo_especializacao,
        description: 'Nome único da especialização',
        example: tipo_especializacao.back_end,
    })

    @IsEnum(tipo_especializacao, {
    message: 'O nome deve ser uma especialização válida (ia, seguranca, dados, front_end, back_end).',
  })

    @IsNotEmpty({message: 'O tipo de especialização é obrigatório'})
    nome: tipo_especializacao;

    @ApiPropertyOptional({
        type: 'string',
        description: 'Descrição da especialização',
        example: 'Especialização em desenvolvimento back-end',
    })

    @IsOptional()
    @IsString({message: 'A descrição deve ser um texto'})
    descricao?: string;

    @ApiProperty({
        enum: tipo_topico_questao,
        description: 'Atributo foco dessa especialização',
        example: tipo_topico_questao.back_end,
    })

    @IsEnum(tipo_topico_questao, {
    message: 'O atributo foco deve ser um tópico válido (ia, seguranca, dados, front_end, back_end).',
  })

    @IsNotEmpty({message: 'O atributo foco da especialização é obrigatório'})
    atributo_foco: tipo_topico_questao;

    @ApiProperty({
        enum: tipo_topico_questao,
        description: 'Atributo de penalidade dessa especialização',
        example: tipo_topico_questao.front_end,
    })

    @IsEnum(tipo_topico_questao, {
    message: 'O atributo de penalidade deve ser um tópico válido (ia, seguranca, dados, front_end, back_end).',
  })

    @IsNotEmpty({message: 'O atributo de penalidade é obrigatório'})
    atributo_penalidade: tipo_topico_questao;

}

