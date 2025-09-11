import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(lang: string = 'en'): Promise<any[]> {
    const products = await this.productsRepository.find();
    return products.map(product => this.transformProduct(product, lang));
  }

  async findOne(id: string, lang: string = 'en'): Promise<any> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    // Increment view_count
    product.view_count += 1;
    await this.productsRepository.save(product);

    return this.transformProduct(product, lang);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }

  private transformProduct(product: Product, lang: string) {
    const { name_en, name_ar, description_en, description_ar, ...rest } = product;

    const localizedProduct = {
      ...rest,
      name: lang === 'ar' ? name_ar : name_en,
      description: lang === 'ar' ? description_ar : description_en,
    };

    return localizedProduct;
  }
}
