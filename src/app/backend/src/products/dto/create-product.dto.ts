import { IsString, IsNumber, IsPositive, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name_en: string;

  @IsString()
  name_ar: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsString()
  @IsOptional()
  description_ar?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  stock: number;

  @IsUUID()
  category_id: string;

  @IsOptional()
  sizes?: object;

  @IsOptional()
  colors?: object;

  @IsArray()
  @IsOptional()
  images?: string[];
}
