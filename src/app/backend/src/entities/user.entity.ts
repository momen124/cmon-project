import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  shipping_info: object;

  @Column({ type: 'enum', enum: ['user', 'admin', 'superadmin'], default: 'user' })
  role: string;
}