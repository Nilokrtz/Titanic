import { SenhasService } from './senhas.service.js';

describe('SenhasService', () => {
  const senhasService = new SenhasService();

  it('gera hashes diferentes e confere a senha correta', async () => {
    const senha = 'senha-segura-123';
    const primeiroHash = await senhasService.gerarHash(senha);
    const segundoHash = await senhasService.gerarHash(senha);

    expect(primeiroHash.startsWith('$argon2id$')).toBe(true);
    expect(primeiroHash).not.toBe(senha);
    expect(primeiroHash).not.toBe(segundoHash);
    expect(await senhasService.conferirSenha(senha, primeiroHash)).toBe(true);
    expect(await senhasService.conferirSenha('senha-incorreta', primeiroHash)).toBe(false);
  });
});
