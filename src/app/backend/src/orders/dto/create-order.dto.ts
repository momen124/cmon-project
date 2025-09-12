import { IsNumber, IsArray, IsObject, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  total_price: number;

  @IsObject()
  @IsNotEmpty()
  shipping_info: any; // JSONB field, adjust based on your schema

  @IsArray()
  orderItems: { productId: string; quantity: number; price: number }[];
}