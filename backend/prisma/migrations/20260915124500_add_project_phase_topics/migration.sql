-- CreateTable
CREATE TABLE "ProjectPhaseTopic" (
    "id" TEXT NOT NULL,
    "projectPhaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "blogUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectPhaseTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectPhaseTopic_projectPhaseId_idx" ON "ProjectPhaseTopic"("projectPhaseId");

-- AddForeignKey
ALTER TABLE "ProjectPhaseTopic" ADD CONSTRAINT "ProjectPhaseTopic_projectPhaseId_fkey" FOREIGN KEY ("projectPhaseId") REFERENCES "ProjectPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
