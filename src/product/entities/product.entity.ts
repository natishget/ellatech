import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "../../transaction/entities/transaction.entity";

@Entity({name: "product"})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
    
    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ unique: true, length: 50 })
    sku: string;

    @Column({ type: 'integer', default: 0 })
    stockQuantity: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // Relationship: One product can have many transactions
    @OneToMany(() => Transaction, transaction => transaction.product)
    transactions: Transaction[];
}
