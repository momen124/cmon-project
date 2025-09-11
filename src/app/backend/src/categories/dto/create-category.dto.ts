import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name_en: string;

  @IsString()
  name_ar: string;
}
