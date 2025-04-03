import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { MenuOrdersService } from './menu-orders.service';
import { MenuOrder } from '../../entities/menu-order.entity';
import { CreateMenuOrderDto } from '../../dto/create-menu-order.dto';

@Controller('menu-orders')
export class MenuOrdersController {
  constructor(private readonly menuOrdersService: MenuOrdersService) {}

  @Get()
  findAll(): Promise<MenuOrder[]> {
    return this.menuOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuOrder> {
    return this.menuOrdersService.findOne(+id);
  }

  @Post()
  create(@Body() createMenuOrderDto: CreateMenuOrderDto): Promise<MenuOrder> {
    return this.menuOrdersService.create(createMenuOrderDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() statusUpdate: { status: string; details?: any },
  ): Promise<MenuOrder> {
    return this.menuOrdersService.updateOrderStatus(
      +id,
      statusUpdate.status,
      statusUpdate.details,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.menuOrdersService.remove(+id);
  }
}
