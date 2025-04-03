import { IsNotEmpty, IsString, IsArray, IsNumber, Min } from 'class-validator';

export class CreateMenuOrderDto {
  @IsNotEmpty()
  @IsString()
  qrCodeLink: string;

  @IsArray()
  @IsNotEmpty()
  itemIds: number[];
}
