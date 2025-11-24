export class CreateTransactionDto {
    productId: number;
    userId: number;
    quantityChange: number;
    type: string;
    description: string;
}
