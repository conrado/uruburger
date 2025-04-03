import { IsNotEmpty, IsString, IsArray, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuOrderDto {
  @ApiProperty({
    description: 'QR code link associated with the order',
    example: 'https://qr.example.com/table42',
  })
  @IsNotEmpty()
  @IsString()
  qrCodeLink: string;

  @ApiProperty({
    description: 'Array of menu item IDs included in this order',
    example: [1, 3, 5],
    type: [Number],
  })
  @IsArray()
  @IsNotEmpty()
  itemIds: number[];
}
