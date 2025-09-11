import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categroy.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("../entities/category.entity").Category[]>;
    findOne(id: string): Promise<import("../entities/category.entity").Category>;
    create(createCategoryDto: CreateCategoryDto): Promise<import("../entities/category.entity").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("../entities/category.entity").Category>;
    remove(id: string): Promise<void>;
}
