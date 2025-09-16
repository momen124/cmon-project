import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @Column()
  type: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  governorate: string;

  @Column()
  postalCode: string;

  @Column()
  phone: string;

  @Column({ default: false })
  isDefault: boolean;
}
