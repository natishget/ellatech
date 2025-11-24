import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Need this import
import { Product } from './entities/product.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

import { TransactionService } from '../transaction/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Transaction])],
  controllers: [ProductController],
  providers: [ProductService, TransactionService],
})
export class ProductModule {}
