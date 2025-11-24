import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Transaction } from "../../transaction/entities/transaction.entity";

@Entity({name: "user"})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;
    
    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];
}
