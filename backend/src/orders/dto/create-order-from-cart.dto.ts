import { IsOptional, IsString } from 'class-validator';

export class CreateOrderFromCartDto {
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
