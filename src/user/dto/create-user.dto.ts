import { Role } from "@prisma/client";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsStrongPassword, IsEmail } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role) 
  @IsOptional()
  role?: Role;
}
