-- CreateTable
CREATE TABLE "ShortUrlSchema" (
    "id" SERIAL NOT NULL,
    "full" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShortUrlSchema_pkey" PRIMARY KEY ("id")
);
