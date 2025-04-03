import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { CreateMenuItemDto } from '../../dto/create-menu-item.dto';

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
      throw new Error(`MenuItem with id ${id} not found`);
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

  async remove(id: number): Promise<void> {
    await this.menuItemRepository.delete(id);
  }
}
