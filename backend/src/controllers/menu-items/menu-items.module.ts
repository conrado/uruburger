import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
