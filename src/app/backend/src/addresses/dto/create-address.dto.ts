import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  type: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  governorate: string;

  @IsString()
  postalCode: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
