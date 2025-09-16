import { IsUUID, IsInt, Min, IsString, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsUUID('4')
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  selectedSize?: string;

  @IsString()
  @IsOptional()
  selectedColor?: string;
}
