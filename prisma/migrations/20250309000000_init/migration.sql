-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "guests" INTEGER,
    "comment" TEXT,
    "source" TEXT,
    "pageUrl" TEXT,
    "userAgent" TEXT,
    "utm" JSONB,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
