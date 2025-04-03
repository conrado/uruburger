import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { CreateMenuItemDto } from '../../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../../dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find();
  }

  async findOne(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOneBy({ id });
    if (!menuItem) {
      throw new NotFoundException(`MenuItem with id ${id} not found`);
    }
    return menuItem;
  }

  findByIds(ids: number[]): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { id: In(ids) },
    });
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    return this.menuItemRepository.save(menuItem);
  }

  async update(
    id: number,
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    // First check if the menu item exists
    await this.findOne(id);

    // Update the item
    await this.menuItemRepository.update(id, updateMenuItemDto);

    // Return the updated item
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Check if the menu item exists first
    await this.findOne(id);

    // If it exists, delete it
    await this.menuItemRepository.delete(id);
  }
}
