import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuOrder } from '../../entities/menu-order.entity';
import { CreateMenuOrderDto } from '../../dto/create-menu-order.dto';
import { MenuItemsService } from '../menu-items/menu-items.service';

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
    const { qrCodeLink, itemIds } = createMenuOrderDto;

    // Find all menu items by their IDs
    const items = await this.menuItemsService.findByIds(itemIds);

    if (items.length !== itemIds.length) {
      throw new NotFoundException('Some menu items were not found');
    }

    // Calculate the total
    const total = items.reduce((sum, item) => sum + Number(item.value), 0);

    // Create a new menu order
    const menuOrder = this.menuOrderRepository.create({
      qrCodeLink,
      items,
      total,
      eventLog: [
        {
          timestamp: new Date(),
          event: 'ORDER_CREATED',
          details: { itemIds },
        },
      ],
    });

    return this.menuOrderRepository.save(menuOrder);
  }

  async updateOrderStatus(
    id: number,
    status: string,
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
