import { Reservation } from "@prisma/client";

export type ReturnReservationDto = Pick<Reservation, "id" | "user_id" | "table_id" | "active" | "date">

export const returnReservationQuery = {
  id: true,
  user_id: true,
  table_id: true,
  active: true,
  date: true
}
