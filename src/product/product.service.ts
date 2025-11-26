import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository, FindOneOptions } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly transactionService: TransactionService,
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    // establish a connection and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create and Save Product (using the transaction's manager) ---
      const product = this.productRepository.create(createProductDto);
      // Use the queryRunner.manager to save the product within the transaction
      const savedProduct = await queryRunner.manager.save(Product, product);

      // prepare transaction record
      const transactionDetails = {
        productId: savedProduct.id,
        userId: userId,
        quantityChange: savedProduct.stockQuantity,
        type: 'PURCHASE', // Or 'IN', as defined in your model
        description: 'Initial stock added on product creation',
      };

      // create transaction (using the same transaction's manager)
      // NOTE: You must update your TransactionService.create to accept the manager
      // OR, for simplicity, use the manager directly here.
      
      const transactionResponse = await queryRunner.manager.save('Transaction', transactionDetails);
      
      // Basic check
      if (!transactionResponse) {
        throw new InternalServerErrorException('Database failed to create transaction record.');
      }
      
      // commit transaction
      await queryRunner.commitTransaction();

      return savedProduct;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof InternalServerErrorException) {
          throw error; // Re-throw the specific error
      }
      throw new BadRequestException('Error creating product or logging transaction: ' + error.message);
      
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
      if (Number.isNaN(idNum)) {
        throw new BadRequestException('Invalid product id');
      }
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }


  async update(id: number | string, updateProductDto: UpdateProductDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    // 1. Establish a connection and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
      if (Number.isNaN(idNum)) {
        throw new BadRequestException('Invalid product id');
      }
      
      // Find the existing product using the transaction's manager
      // Ensure the find operation uses locking if supported and necessary for high concurrency
      const product = await queryRunner.manager.findOne(Product, { 
        where: { id: idNum } 
      } as FindOneOptions<Product>); 
  
      if (!product) {
        throw new NotFoundException(`Product ${idNum} not found`);
      }
      
      // Store original quantity to calculate change later
      const originalStock = product.stockQuantity;
      
      // Apply updates to the entity found within the transaction
      Object.assign(product, updateProductDto);
      
      // 3. Save the updated product within the transaction
      const response = await queryRunner.manager.save(Product, product);
  
      // 4. Log Transaction if stockQuantity was modified
      if (updateProductDto.stockQuantity !== undefined && response.stockQuantity !== originalStock) {
        const quantityChange = response.stockQuantity - originalStock;
        
        // Prepare transaction details
        const transactionDetails = {
          productId: response.id,
          userId: userId,
          quantityChange: quantityChange,
          type: quantityChange > 0 ? 'RESTOCK' : 'SALE', // Use appropriate type
          description: updateProductDto.description || 'Stock quantity adjusted', // Use description from DTO if available
        };

        // 5. Create Transaction within the SAME transaction
        const transactionResponse = await queryRunner.manager.save('Transaction', transactionDetails);
  
        if (!transactionResponse) {
          throw new InternalServerErrorException('Database failed to create transaction record.');
        }
      }
      
      // 6. Commit Transaction: If we reach here, both Product update and Transaction log succeeded
      await queryRunner.commitTransaction();
      
      return response;

    } catch(error) {
      // 7. Rollback Transaction on ANY error
      await queryRunner.rollbackTransaction();
      
      // Re-throw specific errors or wrap generic errors
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof InternalServerErrorException) {
          throw error;
      }
      throw new BadRequestException('Error updating product: ' + error.message);
      
    } finally {
      // 8. Release the QueryRunner
      await queryRunner.release();
    }
  }


  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
