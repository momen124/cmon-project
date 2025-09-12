import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Wishlist } from '../entities/wishlist.entity';
import { Cart } from '../entities/cart.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async seed() {
    try {
      // Seed Users
      const users = [
        {
          email: 'superadmin@example.com',
          name: 'Super Admin',
          password: await bcrypt.hash('superpassword123', 10),
          role: 'superadmin',
        },
        {
          email: 'admin@example.com',
          name: 'Admin User',
          password: await bcrypt.hash('adminpassword123', 10),
          role: 'admin',
        },
        {
          email: 'user@example.com',
          name: 'Regular User',
          password: await bcrypt.hash('userpassword123', 10),
          role: 'user',
        },
      ];

      const savedUsers = await this.userRepository.save(
        users.map((user) => this.userRepository.create(user)),
      );

      // Seed Categories
      const categories = [
        { name_en: 'Electronics', name_ar: 'إلكترونيات' },
        { name_en: 'Clothing', name_ar: 'ملابس' },
      ];

      const savedCategories = await this.categoryRepository.save(
        categories.map((category) => this.categoryRepository.create(category)),
      );

      // Seed Products
      const products = [
        {
          name_en: 'Smartphone',
          name_ar: 'هاتف ذكي',
          price: 599.99,
          stock: 50,
          category: savedCategories[0],
          sizes: ['N/A'],
          colors: ['Black', 'Silver'],
          images: ['smartphone.jpg'],
        },
        {
          name_en: 'T-Shirt',
          name_ar: 'تي شيرت',
          price: 29.99,
          stock: 100,
          category: savedCategories[1],
          sizes: ['S', 'M', 'L'],
          colors: ['Blue', 'White'],
          images: ['tshirt.jpg'],
        },
      ];

      const savedProducts = await this.productRepository.save(
        products.map((product) => this.productRepository.create(product)),
      );

      // Seed Orders
      const orders = [
        {
          user: savedUsers[2], // Regular User
          total_price: 659.98,
          status: OrderStatus.PENDING,
          shipping_info: { address: '123 User St', city: 'Test City' },
        },
      ];

      const savedOrders = await this.orderRepository.save(
        orders.map((order) => this.orderRepository.create(order)),
      );

      // Seed Order Items
      const orderItems = [
        {
          order: savedOrders[0],
          product: savedProducts[0],
          quantity: 1,
          price: 599.99,
        },
        {
          order: savedOrders[0],
          product: savedProducts[1],
          quantity: 2,
          price: 29.99,
        },
      ];

      await this.orderItemRepository.save(
        orderItems.map((item) => this.orderItemRepository.create(item)),
      );

      // Seed Wishlist
      const wishlistItems = [
        { userId: savedUsers[2].id, productId: savedProducts[0].id },
        { userId: savedUsers[2].id, productId: savedProducts[1].id },
      ];

      await this.wishlistRepository.save(
        wishlistItems.map((item) => this.wishlistRepository.create(item)),
      );

      // Seed Cart
      const cartItems = [
        { userId: savedUsers[2].id, productId: savedProducts[0].id, quantity: 1 },
        { userId: savedUsers[2].id, productId: savedProducts[1].id, quantity: 3 },
      ];

      await this.cartRepository.save(
        cartItems.map((item) => this.cartRepository.create(item)),
      );

      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    }
  }

  async clear() {
    try {
      // Clear tables in reverse order to avoid foreign key constraints
      await this.orderItemRepository.delete({});
      await this.orderRepository.delete({});
      await this.wishlistRepository.delete({});
      await this.cartRepository.delete({});
      await this.productRepository.delete({});
      await this.categoryRepository.delete({});
      await this.userRepository.delete({});
      console.log('Database cleared successfully!');
    } catch (error) {
      console.error('Clearing failed:', error);
      throw error;
    }
  }
}