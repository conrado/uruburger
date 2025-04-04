import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderItemDto } from './create-menu-order.dto';

export class AddItemsToOrderDto {
  @ApiProperty({
    description: 'Array of menu items with quantities to add to the order',
    example: [
      { id: 2, quantity: 1 },
      { id: 4, quantity: 2 },
    ],
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Optional observation for adding items',
    example: 'Customer requested extra sauce with the new items',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
