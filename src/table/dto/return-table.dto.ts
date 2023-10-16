import { Table } from "@prisma/client";

export type ReturnTableDto = Pick<Table, "id" | "capacity">

export const returnTableQuery = {
  id: true,
  capacity: true
}
