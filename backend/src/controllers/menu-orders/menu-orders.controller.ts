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
import { AddItemsToOrderDto } from '../../dto/add-items-to-order.dto';
import { CancelItemsFromOrderDto } from '../../dto/cancel-items-from-order.dto';
import { OrderStatus } from '../../entities/order-status.enum';

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
  @ApiBody({
    type: CreateMenuOrderDto,
    examples: {
      basicOrder: {
        summary: 'Basic Order Example',
        description: 'A basic order with multiple items and quantities',
        value: {
          qrCodeLink: 'https://qr.example.com/table42',
          customerId: 'Table42-John',
          items: [
            { id: 1, quantity: 2 },
            { id: 3, quantity: 1 },
          ],
          observation: 'No pickles on burger please',
        },
      },
    },
  })
  @Post()
  create(@Body() createMenuOrderDto: CreateMenuOrderDto): Promise<MenuOrder> {
    return this.menuOrdersService.create(createMenuOrderDto);
  }

  @ApiOperation({ summary: 'Add items to an existing order' })
  @ApiParam({ name: 'id', description: 'Menu order ID' })
  @ApiResponse({
    status: 200,
    description: 'Items have been successfully added to the order',
    type: MenuOrder,
  })
  @ApiResponse({
    status: 404,
    description: 'Order or items not found',
  })
  @ApiBody({
    type: AddItemsToOrderDto,
    examples: {
      addItems: {
        summary: 'Add Items Example',
        description:
          'Adding multiple items with quantities to an existing order',
        value: {
          items: [
            { id: 4, quantity: 1 },
            { id: 7, quantity: 2 },
          ],
          observation: 'Extra ketchup with the fries',
        },
      },
    },
  })
  @Post(':id/add-items')
  addItems(
    @Param('id') id: string,
    @Body() addItemsDto: AddItemsToOrderDto,
  ): Promise<MenuOrder> {
    return this.menuOrdersService.addItemsToOrder(+id, addItemsDto);
  }

  @ApiOperation({ summary: 'Cancel items from an existing order' })
  @ApiParam({ name: 'id', description: 'Menu order ID' })
  @ApiResponse({
    status: 200,
    description: 'Items have been successfully cancelled from the order',
    type: MenuOrder,
  })
  @ApiResponse({
    status: 404,
    description: 'Order or items not found',
  })
  @ApiBody({
    type: CancelItemsFromOrderDto,
    examples: {
      cancelItems: {
        summary: 'Cancel Items Example',
        description: 'Cancelling items with specified quantities from an order',
        value: {
          items: [
            { id: 1, quantity: 1 },
            { id: 3, quantity: 1 },
          ],
          observation: 'Customer changed their mind about these items',
        },
      },
    },
  })
  @Post(':id/cancel-items')
  cancelItems(
    @Param('id') id: string,
    @Body() cancelItemsDto: CancelItemsFromOrderDto,
  ): Promise<MenuOrder> {
    return this.menuOrdersService.cancelItemsFromOrder(+id, cancelItemsDto);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Menu order ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: OrderStatus.PREPARING,
          description: 'New status for the order',
          enum: Object.values(OrderStatus),
        },
        details: {
          type: 'object',
          example: {
            note: 'Customer requested extra sauce',
            estimatedTime: 15,
            observation: 'Priority order for VIP customer',
          },
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
    @Body() statusUpdate: { status: OrderStatus; details?: any },
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
