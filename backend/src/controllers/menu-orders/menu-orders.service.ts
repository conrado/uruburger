import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuOrder } from '../../entities/menu-order.entity';
import { MenuItem } from '../../entities/menu-item.entity';
import {
  CreateMenuOrderDto,
  OrderItemDto,
} from '../../dto/create-menu-order.dto';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { OrderStatus } from '../../entities/order-status.enum';
import { AddItemsToOrderDto } from '../../dto/add-items-to-order.dto';
import { CancelItemsFromOrderDto } from '../../dto/cancel-items-from-order.dto';

@Injectable()
export class MenuOrdersService {
  constructor(
    @InjectRepository(MenuOrder)
    private menuOrderRepository: Repository<MenuOrder>,
    private menuItemsService: MenuItemsService,
  ) {}

  findAll(): Promise<MenuOrder[]> {
    return this.menuOrderRepository.find({ relations: ['items'] });
  }

  async findOne(id: number): Promise<MenuOrder> {
    const order = await this.menuOrderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async create(createMenuOrderDto: CreateMenuOrderDto): Promise<MenuOrder> {
    const { qrCodeLink, items, observation, customerId } = createMenuOrderDto;

    // Extract item IDs from the items array
    const itemIds = items.map((item) => item.id);

    // Find all menu items by their IDs
    const menuItems = await this.menuItemsService.findByIds(itemIds);

    if (menuItems.length !== itemIds.length) {
      throw new NotFoundException('Some menu items were not found');
    }

    // Calculate the total with quantities
    const total = items.reduce((sum, orderItem) => {
      const menuItem = menuItems.find((item) => item.id === orderItem.id);
      if (!menuItem) {
        throw new NotFoundException(
          `Menu item with ID ${orderItem.id} not found`,
        );
      }
      return sum + Number(menuItem.value) * orderItem.quantity;
    }, 0);

    // Create item quantities map for the event log
    const itemQuantities = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name:
        menuItems.find((menuItem) => menuItem.id === item.id)?.name ||
        'Unknown Item',
    }));

    // Create a new menu order with the items repeated based on quantity
    const orderItems = items.flatMap((orderItem) => {
      const menuItem = menuItems.find((item) => item.id === orderItem.id);
      return Array(orderItem.quantity).fill(menuItem);
    });

    const menuOrder = this.menuOrderRepository.create({
      qrCodeLink,
      customerId,
      items: orderItems,
      total,
      eventLog: [
        {
          timestamp: new Date(),
          event: OrderStatus.ORDER_CREATED,
          details: {
            items: itemQuantities,
            itemCount: orderItems.length,
            observation: observation || null,
          },
        },
      ],
    });

    return this.menuOrderRepository.save(menuOrder);
  }

  async addItemsToOrder(
    id: number,
    addItemsDto: AddItemsToOrderDto,
  ): Promise<MenuOrder> {
    const order = await this.findOne(id);
    const { items, observation } = addItemsDto;

    // Extract item IDs from the items array
    const itemIds = items.map((item) => item.id);

    // Find all menu items by their IDs
    const menuItems = await this.menuItemsService.findByIds(itemIds);

    if (menuItems.length !== itemIds.length) {
      throw new NotFoundException('Some menu items were not found');
    }

    // Calculate the new total
    const additionalTotal = items.reduce((sum, orderItem) => {
      const menuItem = menuItems.find((item) => item.id === orderItem.id);
      if (!menuItem) {
        throw new NotFoundException(
          `Menu item with ID ${orderItem.id} not found`,
        );
      }
      return sum + Number(menuItem.value) * orderItem.quantity;
    }, 0);

    order.total = Number(order.total) + additionalTotal;

    // Create item quantities map for the event log
    const itemQuantities = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name:
        menuItems.find((menuItem) => menuItem.id === item.id)?.name ||
        'Unknown Item',
    }));

    // Add the new items to the order - ensuring uniqueness
    // First, create a Set of existing item IDs to check duplicates
    const existingItemIds = new Set(order.items.map((item) => item.id));

    // Add only unique items to the order
    const uniqueNewItems = menuItems.filter(
      (item) => !existingItemIds.has(item.id),
    );
    order.items = [...order.items, ...uniqueNewItems];

    // Add a new event to the event log
    order.eventLog.push({
      timestamp: new Date(),
      event: OrderStatus.ITEMS_ADDED,
      details: {
        items: itemQuantities,
        itemCount: items.reduce((total, item) => total + item.quantity, 0),
        observation: observation || null,
      },
    });

    return this.menuOrderRepository.save(order);
  }

  async cancelItemsFromOrder(
    id: number,
    cancelItemsDto: CancelItemsFromOrderDto,
  ): Promise<MenuOrder> {
    const order = await this.findOne(id);
    const { items, observation } = cancelItemsDto;

    // Create a map of item IDs to quantities that need to be cancelled
    const cancelMap = new Map<number, number>();
    items.forEach((item) => cancelMap.set(item.id, item.quantity));

    // Keep track of items actually cancelled for the event log
    const cancelledItems: { id: number; quantity: number; name: string }[] = [];

    // Track items that remain after cancellation
    const remainingItems: MenuItem[] = [];

    // Track the refund amount
    let refundAmount = 0;

    // Group order items by ID to process cancellations
    const itemsGrouped: Record<string, MenuItem[]> = order.items.reduce(
      (groups, item) => {
        const key = item.id;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      },
      {} as Record<string, MenuItem[]>,
    );

    // Process each group of items
    for (const [itemId, items] of Object.entries(itemsGrouped)) {
      const id = Number(itemId);
      const quantityToCancel = cancelMap.get(id) || 0;

      if (quantityToCancel > 0) {
        if (quantityToCancel > items.length) {
          throw new NotFoundException(
            `Order only has ${items.length} of item ID ${id}, cannot cancel ${quantityToCancel}`,
          );
        }

        // Add to the cancelled items list
        const cancelledItem = items[0]; // Using first item for info
        cancelledItems.push({
          id,
          quantity: quantityToCancel,
          name: cancelledItem.name,
        });

        // Calculate refund amount
        refundAmount += Number(cancelledItem.value) * quantityToCancel;

        // Keep remaining items
        remainingItems.push(...items.slice(quantityToCancel));
      } else {
        // Keep all items if not cancelling any
        remainingItems.push(...items);
      }
    }

    if (cancelledItems.length === 0) {
      throw new NotFoundException(
        'None of the specified items were found in the order',
      );
    }

    // Update the order total
    order.total = Number(order.total) - refundAmount;

    // Update the order items
    order.items = remainingItems;

    // Add a new event to the event log
    order.eventLog.push({
      timestamp: new Date(),
      event: OrderStatus.ITEMS_CANCELLED,
      details: {
        items: cancelledItems,
        itemCount: cancelledItems.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        refundAmount,
        observation: observation || null,
      },
    });

    return this.menuOrderRepository.save(order);
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
    details: any = {},
  ): Promise<MenuOrder> {
    const order = await this.findOne(id);

    // Add a new event to the event log
    order.eventLog.push({
      timestamp: new Date(),
      event: status,
      details,
    });

    return this.menuOrderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.menuOrderRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
