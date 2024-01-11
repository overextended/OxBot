-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "warns" INTEGER NOT NULL DEFAULT 0,
    "timeouts" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Warn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Warn_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Warn" ("id", "issuedAt", "issuerId", "reason", "targetId") SELECT "id", "issuedAt", "issuerId", "reason", "targetId" FROM "Warn";
DROP TABLE "Warn";
ALTER TABLE "new_Warn" RENAME TO "Warn";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
