import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try{
      const transaction = this.transactionRepository.create(createTransactionDto);
      const response = await this.transactionRepository.save(transaction);
      return true;
      
    } catch(error) {
      throw new BadRequestException('Error creating transaction: ' + error.message);
    }
  }

  async findAll() {
    const transactions = await this.transactionRepository.find({ relations: ['user', 'product'] });
    return transactions.map(t => {
      if (t.user && typeof t.user === 'object') {
        // @ts-ignore
        delete t.user.password;
      }
      return t;
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} transaction`;
  // }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
