import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    console.log('Starting database seeding...');

    try {
      // Check if data already exists
      const existingUsers = await this.userRepository.count();
      if (existingUsers > 0) {
        console.log('Database already has data. Skipping seeding...');
        return;
      }

      // Create categories first
      console.log('Creating categories...');
      const electronicsCategory = this.categoryRepository.create({
        name_en: 'Electronics',
        name_ar: 'إلكترونيات'
      });
      const clothingCategory = this.categoryRepository.create({
        name_en: 'Clothing',
        name_ar: 'ملابس'
      });

      const savedCategories = await this.categoryRepository.save([
        electronicsCategory,
        clothingCategory
      ]);

      console.log('Categories created successfully');

      // Seed users
      console.log('Creating users...');
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      const hashedUserPassword = await bcrypt.hash('user123', 10);

      const adminUser = this.userRepository.create({
        email: 'admin@example.com',
        password: hashedAdminPassword,
        name: 'Admin User',
        role: 'admin',
        shipping_info: { address: '123 Main St', city: 'Cairo', country: 'Egypt' },
      });

      const regularUser = this.userRepository.create({
        email: 'user@example.com',
        password: hashedUserPassword,
        name: 'Regular User',
        role: 'user',
        shipping_info: { address: '456 User St', city: 'Cairo', country: 'Egypt' },
      });

      await this.userRepository.save([adminUser, regularUser]);
      console.log('Users created successfully');

      // Seed products
      console.log('Creating products...');
      const smartphone = this.productRepository.create({
        name_en: 'Smartphone',
        name_ar: 'هاتف ذكي',
        description_en: 'Latest model smartphone with advanced features',
        description_ar: 'أحدث موديل هاتف ذكي بميزات متقدمة',
        price: 699.99,
        stock: 50,
        category_id: savedCategories[0].id, // Electronics
        sizes: { "N/A": true },
        colors: { "Black": true, "Silver": true, "Gold": true },
        images: ['smartphone1.jpg', 'smartphone2.jpg'],
        view_count: 0,
      });

      const tshirt = this.productRepository.create({
        name_en: 'Cotton T-Shirt',
        name_ar: 'تي شيرت قطني',
        description_en: 'Comfortable cotton t-shirt for everyday wear',
        description_ar: 'تي شيرت قطني مريح للارتداء اليومي',
        price: 29.99,
        stock: 100,
        category_id: savedCategories[1].id, // Clothing
        sizes: { "S": true, "M": true, "L": true, "XL": true },
        colors: { "White": true, "Black": true, "Blue": true, "Red": true },
        images: ['tshirt1.jpg', 'tshirt2.jpg'],
        view_count: 0,
      });

      const laptop = this.productRepository.create({
        name_en: 'Gaming Laptop',
        name_ar: 'لابتوب ألعاب',
        description_en: 'High-performance gaming laptop with dedicated graphics',
        description_ar: 'لابتوب ألعاب عالي الأداء مع كارت رسومات مخصص',
        price: 1299.99,
        stock: 25,
        category_id: savedCategories[0].id, // Electronics
        sizes: { "15-inch": true, "17-inch": true },
        colors: { "Black": true, "Gray": true },
        images: ['laptop1.jpg', 'laptop2.jpg'],
        view_count: 0,
      });

      await this.productRepository.save([smartphone, tshirt, laptop]);
      console.log('Products created successfully');

      console.log('Database seeding completed successfully!');
      console.log('Created:');
      console.log('- 2 categories');
      console.log('- 2 users (admin@example.com / admin123, user@example.com / user123)');
      console.log('- 3 products');

    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    }
  }

  async clear() {
    console.log('Clearing database...');
    try {
      // Clear in correct order to avoid foreign key constraints
      await this.productRepository.clear();
      await this.categoryRepository.clear();
      await this.userRepository.clear();
      console.log('Database cleared successfully!');
    } catch (error) {
      console.error('Database clearing failed:', error);
      throw error;
    }
  }
}