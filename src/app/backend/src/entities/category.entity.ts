import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name_en: string;

  @Index()
  @Column()
  name_ar: string;
}
