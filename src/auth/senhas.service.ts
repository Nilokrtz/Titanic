import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class SenhasService {
  gerarHash(senha: string): Promise<string> {
    return argon2.hash(senha);
  }

  conferirSenha(senha: string, hashSenha: string): Promise<boolean> {
    return argon2.verify(hashSenha, senha);
  }
}
