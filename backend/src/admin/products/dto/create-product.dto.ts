import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string; // You will generate slug on backend

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
