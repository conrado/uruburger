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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('menu-orders')
@Controller('menu-orders')
export class MenuOrdersController {
  constructor(private readonly menuOrdersService: MenuOrdersService) {}

  @ApiOperation({ summary: 'Get all menu orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all menu orders',
    type: [MenuOrder],
  })
  @Get()
  findAll(): Promise<MenuOrder[]> {
    return this.menuOrdersService.findAll();
  }

  @ApiOperation({ summary: 'Get a menu order by ID' })
  @ApiParam({ name: 'id', description: 'Menu order ID' })
  @ApiResponse({
    status: 200,
    description: 'The found menu order',
    type: MenuOrder,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu order not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuOrder> {
    return this.menuOrdersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create a new menu order' })
  @ApiResponse({
    status: 201,
    description: 'The menu order has been successfully created',
    type: MenuOrder,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @Post()
  create(@Body() createMenuOrderDto: CreateMenuOrderDto): Promise<MenuOrder> {
    return this.menuOrdersService.create(createMenuOrderDto);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Menu order ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'completed',
          description: 'New status for the order',
        },
        details: {
          type: 'object',
          example: { note: 'Customer requested extra sauce' },
          description: 'Additional details for the status update',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The order status has been updated successfully',
    type: MenuOrder,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
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

  @ApiOperation({ summary: 'Delete a menu order' })
  @ApiParam({ name: 'id', description: 'Menu order ID to delete' })
  @ApiResponse({
    status: 200,
    description: 'The menu order has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu order not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.menuOrdersService.remove(+id);
  }
}
