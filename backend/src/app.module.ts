import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuItem } from './entities/menu-item.entity';
import { MenuOrder } from './entities/menu-order.entity';
import { MenuItemsModule } from './controllers/menu-items/menu-items.module';
import { MenuOrdersModule } from './controllers/menu-orders/menu-orders.module';
import { ClockModule } from './controllers/clock/clock.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [MenuItem, MenuOrder],
      synchronize: true,
    }),
    MenuItemsModule,
    MenuOrdersModule,
    ClockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
