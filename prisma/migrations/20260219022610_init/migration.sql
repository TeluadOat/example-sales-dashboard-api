-- CreateTable
CREATE TABLE "VolumeService" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL,
    "averageResponseTime" DOUBLE PRECISION NOT NULL,
    "successRate" DOUBLE PRECISION NOT NULL,
    "errorRate" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolumeService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSatisfaction" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dailyScore" DOUBLE PRECISION NOT NULL,
    "previousMonthAverage" DOUBLE PRECISION NOT NULL,
    "currentMonthAverage" DOUBLE PRECISION NOT NULL,
    "comparisonPercent" DOUBLE PRECISION NOT NULL,
    "feedbackSummary" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSatisfaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kpi" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "growthRate" DOUBLE PRECISION NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TargetReality" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "targetSales" DOUBLE PRECISION NOT NULL,
    "actualSales" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TargetReality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "onlineSales" DOUBLE PRECISION NOT NULL,
    "offlineSales" DOUBLE PRECISION NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL,
    "isForecast" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorInsight" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "loyalVisitors" INTEGER NOT NULL,
    "newVisitors" INTEGER NOT NULL,
    "uniqueVisitors" INTEGER NOT NULL,
    "totalVisitors" INTEGER NOT NULL,
    "growthRate" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "totalSales" INTEGER NOT NULL,
    "unitsSold" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesMap" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "totalSales" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "salesBreakdown" JSONB NOT NULL,
    "recordedDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSatisfaction_id_key" ON "CustomerSatisfaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Kpi_id_key" ON "Kpi"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Revenue_id_key" ON "Revenue"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorInsight_id_key" ON "VisitorInsight"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TopProduct_id_key" ON "TopProduct"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TopProduct_sku_key" ON "TopProduct"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "SalesMap_id_key" ON "SalesMap"("id");
