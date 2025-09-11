import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(lang: string): Promise<any[]>;
    findOne(id: string, lang: string): Promise<any>;
    create(createProductDto: CreateProductDto): Promise<import("../entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../entities/product.entity").Product>;
    remove(id: string): Promise<void>;
}
