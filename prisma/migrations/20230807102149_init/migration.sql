-- CreateIndex
CREATE INDEX "Bike_createdAt_kioskId_idx" ON "Bike"("createdAt", "kioskId");

-- CreateIndex
CREATE INDEX "Weather_createdAt_cityId_idx" ON "Weather"("createdAt", "cityId");
