/*
  Warnings:

  - You are about to drop the column `deleteAfterRead` on the `pastes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."pastes" DROP COLUMN "deleteAfterRead";
