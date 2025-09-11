import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-categroy.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
