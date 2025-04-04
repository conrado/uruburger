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

export class CancelItemsFromOrderDto {
  @ApiProperty({
    description: 'Array of menu items with quantities to cancel from the order',
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
    description: 'Optional observation for canceling items',
    example: 'Customer no longer wants these items',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
