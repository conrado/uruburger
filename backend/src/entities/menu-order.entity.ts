import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from './order-status.enum';

@Entity()
export class MenuOrder {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'QR code link associated with the order',
    example: 'https://qr.example.com/table42',
  })
  @Column()
  qrCodeLink: string;

  @ApiProperty({
    description: 'Customer identifier as a mnemonic',
    example: 'Table42-John',
    required: false,
  })
  @Column({ nullable: true })
  customerId: string;

  @ApiProperty({
    description: 'Menu items included in this order',
    type: [MenuItem],
  })
  @ManyToMany(() => MenuItem)
  @JoinTable()
  items: MenuItem[];

  @ApiProperty({
    description: 'Total price of the order',
    example: 24.99,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    description: 'Log of events related to this order',
    example: [
      {
        timestamp: '2025-04-03T14:30:45.123Z',
        event: OrderStatus.ORDER_CREATED,
        details: { employee: 'John' },
      },
    ],
  })
  @Column('json')
  eventLog: Array<{
    timestamp: Date;
    event: OrderStatus;
    details: any;
  }>;
}
