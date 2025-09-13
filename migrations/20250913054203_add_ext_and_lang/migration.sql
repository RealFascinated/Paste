-- AlterTable
ALTER TABLE "public"."pastes" ADD COLUMN     "ext" TEXT NOT NULL DEFAULT 'txt',
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'text';
