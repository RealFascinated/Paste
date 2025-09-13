-- CreateTable
CREATE TABLE "public"."pastes" (
    "id" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pastes_pkey" PRIMARY KEY ("id")
);
