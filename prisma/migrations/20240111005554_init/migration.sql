/*
  Warnings:

  - You are about to drop the column `releaseDate` on the `Ban` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ban" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Ban" ("id", "issuedAt", "issuerId", "reason", "targetId") SELECT "id", "issuedAt", "issuerId", "reason", "targetId" FROM "Ban";
DROP TABLE "Ban";
ALTER TABLE "new_Ban" RENAME TO "Ban";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
