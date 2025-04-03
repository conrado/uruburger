import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'QR code link for the menu item',
    example: 'https://qr.example.com/item123',
  })
  @IsNotEmpty()
  @IsString()
  qrCodeLink: string;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Classic Cheeseburger',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Price of the menu item',
    example: 12.99,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({
    description: 'Detailed description of the menu item',
    example:
      'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL to the menu item image',
    example: 'https://images.example.com/cheeseburger.jpg',
  })
  @IsNotEmpty()
  @IsString()
  imageLink: string;
}
