export declare class CreateProductDto {
    name_en: string;
    name_ar: string;
    description_en?: string;
    description_ar?: string;
    price: number;
    stock: number;
    category_id: string;
    sizes?: object;
    colors?: object;
    images?: string[];
}
