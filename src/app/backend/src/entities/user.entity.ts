import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Wishlist } from './wishlist.entity';
import { Cart } from './cart.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'superadmin'], default: 'user' })
  role: string;

  @Column({ type: 'jsonb', nullable: true })
  shipping_info: object;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];
}