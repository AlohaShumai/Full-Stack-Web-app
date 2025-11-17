import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsPositive,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class OrderItemInput {
    @IsInt()
    productId: number;
  
    @IsInt()
    @IsPositive()
    quantity: number;
  }
  
  export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemInput)
    items: OrderItemInput[];
  }
  