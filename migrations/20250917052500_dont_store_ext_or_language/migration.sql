/*
  Warnings:

  - You are about to drop the column `ext` on the `pastes` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `pastes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."pastes" DROP COLUMN "ext",
DROP COLUMN "language";
