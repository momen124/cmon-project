import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name_en: string;

  @Index()
  @Column()
  name_ar: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({ type: 'text', nullable: true })
  description_ar: string;

  @Index()
  @Column({ type: 'decimal' })
  price: number;

  @Column()
  stock: number;

  @Index()
  @Column()
  category_id: string;

  @Index()
  @Column({ type: 'jsonb', nullable: true })
  sizes: object;

  @Index()
  @Column({ type: 'jsonb', nullable: true })
  colors: object;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column({ default: 0 })
  view_count: number;
}