-- CreateTable
CREATE TABLE "VolumeService" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceName" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL,
    "averageResponseTime" REAL NOT NULL,
    "successRate" REAL NOT NULL,
    "errorRate" REAL NOT NULL,
    "metadata" JSONB NOT NULL,
    "recordedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CustomerSatisfaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "dailyScore" REAL NOT NULL,
    "previousMonthAverage" REAL NOT NULL,
    "currentMonthAverage" REAL NOT NULL,
    "comparisonPercent" REAL NOT NULL,
    "feedbackSummary" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Kpi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "targetValue" REAL NOT NULL,
    "growthRate" REAL NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TargetReality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetValue" REAL NOT NULL,
    "actualValue" REAL NOT NULL,
    "variance" REAL NOT NULL,
    "variancePercentage" REAL NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "topProductId" TEXT NOT NULL,
    "visitorInsightId" TEXT NOT NULL,
    "revenueId" TEXT NOT NULL,
    "customerSatisfactionId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "onlineSales" REAL NOT NULL,
    "offlineSales" REAL NOT NULL,
    "totalRevenue" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "notes" TEXT NOT NULL,
    "isForecast" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VisitorInsight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "loyalVisitors" INTEGER NOT NULL,
    "newVisitors" INTEGER NOT NULL,
    "uniqueVisitors" INTEGER NOT NULL,
    "totalVisitors" INTEGER NOT NULL,
    "growthRate" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TopProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "totalSales" INTEGER NOT NULL,
    "unitsSold" INTEGER NOT NULL,
    "revenue" REAL NOT NULL,
    "averageRating" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SalesMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "totalSales" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "salesBreakdown" JSONB NOT NULL,
    "recordedDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSatisfaction_id_key" ON "CustomerSatisfaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Kpi_id_key" ON "Kpi"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TargetReality_id_key" ON "TargetReality"("id");

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
