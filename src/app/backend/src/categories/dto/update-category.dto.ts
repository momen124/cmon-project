import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';  // FIXED: 'create-category.dto' (no 'g' in categroy)

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}