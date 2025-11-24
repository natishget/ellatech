import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly transactionService: TransactionService
  ) {}


  async create(createProductDto: CreateProductDto, userId: number) {
    const product = this.productRepository.create(createProductDto);
    const response = await this.productRepository.save(product);
    const transaction = {
      productId: response.id,
      userId: userId,
      quantityChange: response.stockQuantity,
      type: 'PURCHASE',
      description: 'Initial stock added on product creation',
    };
    const transactionResponse = await this.transactionService.create(transaction);

    if(!transactionResponse) {
      throw new Error('Transaction creation failed');
    }
    
    return response;
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    return await this.productRepository.findOne({ where: { id } });
  }

  async update(id: number | string, updateProductDto: UpdateProductDto, userId: number) {
    const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
    if (Number.isNaN(idNum)) throw new BadRequestException('Invalid product id');

    const product = await this.findOne(idNum);

    if (!product) throw new NotFoundException(`Product ${idNum} not found`);
    const response = await this.productRepository.save(product);

    if (updateProductDto.stockQuantity !== undefined) {
      const quantityChange = updateProductDto.stockQuantity - product.stockQuantity;
      const transaction = {
        productId: response.id,
        userId: userId,
        quantityChange,
        type: 'ADJUSTMENT',
        description: 'Stock quantity adjusted',
      };
      const transactionResponse = await this.transactionService.create(transaction);

      if (!transactionResponse) {
        throw new Error('Transaction creation failed');
      }
    }
    
    return response;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
