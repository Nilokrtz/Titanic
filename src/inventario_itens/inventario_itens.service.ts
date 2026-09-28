import { Injectable } from '@nestjs/common';
import { CreateInventarioItenDto } from './dto/create-inventario_iten.dto.js';
import { UpdateInventarioItenDto } from './dto/update-inventario_iten.dto.js';

@Injectable()
export class InventarioItensService {
  create(createInventarioItenDto: CreateInventarioItenDto) {
    return 'This action adds a new inventarioIten';
  }

  findAll() {
    return `This action returns all inventarioItens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventarioIten`;
  }

  update(id: number, updateInventarioItenDto: UpdateInventarioItenDto) {
    return `This action updates a #${id} inventarioIten`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventarioIten`;
  }
}
