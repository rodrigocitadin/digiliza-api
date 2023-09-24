import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  table_id: string;

  @IsDate()
  @IsNotEmpty()
  to_date: Date;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
