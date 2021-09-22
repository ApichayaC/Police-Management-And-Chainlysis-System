-- CreateTable
CREATE TABLE "Transaction" (
    "hash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timeStamp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "DataSnapshot" (
    "sender" TEXT NOT NULL,
    "startBlock" INTEGER NOT NULL DEFAULT 0,
    "endBlock" INTEGER NOT NULL DEFAULT 0,
    "latestSyncBlock" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("sender")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataSnapshot.sender_unique" ON "DataSnapshot"("sender");
