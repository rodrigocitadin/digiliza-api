import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @IsNotEmpty()
  table_id: number;

  @IsDate()
  @IsNotEmpty()
  to_date: Date;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
