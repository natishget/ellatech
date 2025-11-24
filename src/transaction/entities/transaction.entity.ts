import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  // The change in quantity (positive for increase, negative for decrease)
  @Column({ type: 'integer' })
  quantityChange: number; 

  @Column({ length: 50 })
  type: string; // e.g., 'SALE', 'INVENTORY_ADJUSTMENT', 'PURCHASE'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  // Relationships (Foreign Keys)
  
  @ManyToOne(() => Product, product => product.transactions)
  @JoinColumn({ name: 'productId' }) // Defines the foreign key column name
  product: Product;
  
  @Column()
  productId: number; // Storing the foreign key explicitly

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @Column()
  userId: number; // Storing the foreign key explicitly
}