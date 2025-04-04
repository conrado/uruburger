import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    description: 'Menu item ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Quantity of this menu item',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateMenuOrderDto {
  @ApiProperty({
    description: 'QR code link associated with the order',
    example: 'https://qr.example.com/table42',
  })
  @IsNotEmpty()
  @IsString()
  qrCodeLink: string;

  @ApiProperty({
    description: 'Customer identifier as a mnemonic',
    example: 'Table42-John',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'Array of menu items with quantities included in this order',
    example: [
      { id: 1, quantity: 2 },
      { id: 3, quantity: 1 },
      { id: 5, quantity: 3 },
    ],
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Optional observation for the order creation',
    example: 'Customer requested no pickles',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
