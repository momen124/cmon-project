import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('cart')
export class Cart {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  productId: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  selectedSize?: string;

  @Column({ nullable: true })
  selectedColor?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}