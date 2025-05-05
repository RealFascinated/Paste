/*
  Warnings:

  - You are about to drop the column `lang` on the `pastes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pastes" DROP COLUMN "lang",
ADD COLUMN     "ext" TEXT NOT NULL DEFAULT 'txt',
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'text',
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
