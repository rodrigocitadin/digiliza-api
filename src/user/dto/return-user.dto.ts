import { User } from '@prisma/client'

export type ReturnUserDto = Pick<User, "id" | "email" | "name">

export const returnUserQuery = {
  id: true,
  name: true,
  email: true
}
