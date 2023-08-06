-- Create Schema
CREATE SCHEMA IF NOT EXISTS bikes_data;

-- CreateTable
CREATE TABLE "Bike" (
    "kioskId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdAtHour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bike_pkey" PRIMARY KEY ("kioskId","createdAtHour")
);

-- CreateTable
CREATE TABLE "Weather" (
    "cityId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdAtHour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weather_pkey" PRIMARY KEY ("cityId","createdAtHour")
);
