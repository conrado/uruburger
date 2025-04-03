import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from '../../entities/menu-item.entity';
import { CreateMenuItemDto } from '../../dto/create-menu-item.dto';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemsService.findOne(+id);
  }

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.menuItemsService.remove(+id);
  }
}
