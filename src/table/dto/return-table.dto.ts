import { Table } from "@prisma/client";

export type ReturnTableDto = Pick<Table, "id" | "capacity">

