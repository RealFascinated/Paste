/*
  Warnings:

  - Added the required column `lang` to the `pastes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pastes" ADD COLUMN     "lang" TEXT NOT NULL;
