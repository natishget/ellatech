import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() body: any) {
    const { userId, ...payload } = body;
    const dto = payload as CreateProductDto;
    return this.productService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('/status/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put('/adjust/:id')
  update(@Param('id') id: string, @Body() body: any) {
    const { userId, ...payload } = body;
    const dto = payload as UpdateProductDto;
    return this.productService.update(+id, dto, userId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }
}
