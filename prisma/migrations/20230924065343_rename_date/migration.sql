/*
  Warnings:

  - You are about to drop the column `to_date` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `date` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "to_date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
