import {
    IsString,
    IsOptional,
    IsNumber,
    IsInt,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateProductDto {
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @Type(() => Number)
    @IsNumber()
    price: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    stock?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;
  
    @IsOptional()
    @IsString()
    slug?: string;
  
    @IsOptional()
    @IsString()
    imageUrl?: string; // 👈 this fixes the TS errors in catalog.service.ts
  }
  