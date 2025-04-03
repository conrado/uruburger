import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuOrder } from '../../entities/menu-order.entity';
import { MenuOrdersController } from './menu-orders.controller';
import { MenuOrdersService } from './menu-orders.service';
import { MenuItemsModule } from '../menu-items/menu-items.module';

@Module({
  imports: [TypeOrmModule.forFeature([MenuOrder]), MenuItemsModule],
  controllers: [MenuOrdersController],
  providers: [MenuOrdersService],
  exports: [MenuOrdersService],
})
export class MenuOrdersModule {}
