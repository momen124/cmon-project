import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['user', 'admin', 'superadmin'])
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}