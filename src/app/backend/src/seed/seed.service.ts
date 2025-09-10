import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async seed() {
    // Seed an admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = this.userRepository.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      shipping_info: { address: '123 Main St', city: 'Cairo', country: 'Egypt' },
    });
    await this.userRepository.save(user);

    // Seed a sample product
    const product = this.productRepository.create({
      name_en: 'Sample Product',
      name_ar: 'منتج عينة',
      description_en: 'A sample product description',
      description_ar: 'وصف منتج عينة',
      price: 99.99,
      stock: 100,
      category_id: 'category_1',
      sizes: { small: true, medium: true, large: false },
      colors: { red: true, blue: true },
      images: ['https://example.com/image.jpg'],
      view_count: 0,
    });
    await this.productRepository.save(product);
  }
}