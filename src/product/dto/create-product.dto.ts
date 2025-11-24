import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name!: string

    @IsString()
    description?: string;

    @IsNotEmpty()
    price!: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    sku!: string;

    @IsNotEmpty()
    @IsNumber()
    stockQuantity!: number;

}
