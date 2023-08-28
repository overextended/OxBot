-- CreateTable
CREATE TABLE "Warns" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL
);
