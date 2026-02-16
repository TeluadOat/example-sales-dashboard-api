/*
  Warnings:

  - You are about to drop the column `actualValue` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `customerSatisfactionId` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `kpiId` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `periodEnd` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `revenueId` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `targetValue` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `topProductId` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `variance` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `variancePercentage` on the `TargetReality` table. All the data in the column will be lost.
  - You are about to drop the column `visitorInsightId` on the `TargetReality` table. All the data in the column will be lost.
  - Added the required column `actualSales` to the `TargetReality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetSales` to the `TargetReality` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TargetReality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "periodStart" DATETIME NOT NULL,
    "targetSales" REAL NOT NULL,
    "actualSales" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TargetReality" ("createdAt", "id", "periodStart") SELECT "createdAt", "id", "periodStart" FROM "TargetReality";
DROP TABLE "TargetReality";
ALTER TABLE "new_TargetReality" RENAME TO "TargetReality";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
