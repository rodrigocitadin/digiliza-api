import { Reservation } from "@prisma/client";

export type ReturnReservationDto = Pick<Reservation, "id" | "user_id" | "table_id" | "active" | "date">
