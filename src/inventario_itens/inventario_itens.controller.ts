import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventarioItensService } from './inventario_itens.service.js';
import { CreateInventarioItenDto } from './dto/create-inventario_iten.dto.js';
import { UpdateInventarioItenDto } from './dto/update-inventario_iten.dto.js';

@Controller('inventario-itens')
export class InventarioItensController {
  constructor(private readonly inventarioItensService: InventarioItensService) {}

  @Post()
  create(@Body() createInventarioItenDto: CreateInventarioItenDto) {
    return this.inventarioItensService.create(createInventarioItenDto);
  }

  @Get()
  findAll() {
    return this.inventarioItensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioItensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioItenDto: UpdateInventarioItenDto) {
    return this.inventarioItensService.update(+id, updateInventarioItenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventarioItensService.remove(+id);
  }
}
