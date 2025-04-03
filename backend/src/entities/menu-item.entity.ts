import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MenuItem {
  @ApiProperty({
    description: 'Unique identifier for the menu item',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'QR code link for the menu item',
    example: 'https://qr.example.com/item123',
  })
  @Column()
  qrCodeLink: string;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Classic Cheeseburger',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Price of the menu item',
    example: 12.99,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @ApiProperty({
    description: 'Detailed description of the menu item',
    example:
      'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'URL to the menu item image',
    example: 'https://images.example.com/cheeseburger.jpg',
  })
  @Column()
  imageLink: string;
}
