-- CreateTable
CREATE TABLE "Protocol" (
    "id" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "dateDay" INTEGER NOT NULL,
    "dateMonth" INTEGER NOT NULL,
    "dateYear" INTEGER NOT NULL,
    "resultValue" DOUBLE PRECISION NOT NULL,
    "level" TEXT NOT NULL,
    "sportTitle" TEXT,
    "sportTitleFrom" TIMESTAMP(3),
    "sportTitleTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportTitle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SportTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextToNumberMapping" (
    "id" TEXT NOT NULL,
    "textValue" TEXT NOT NULL,
    "numberValue" DOUBLE PRECISION NOT NULL,
    "testType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TextToNumberMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Protocol_testType_idx" ON "Protocol"("testType");

-- CreateIndex
CREATE INDEX "Protocol_level_idx" ON "Protocol"("level");

-- CreateIndex
CREATE INDEX "Protocol_dateYear_dateMonth_dateDay_idx" ON "Protocol"("dateYear", "dateMonth", "dateDay");

-- CreateIndex
CREATE UNIQUE INDEX "TestType_name_key" ON "TestType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Level_name_key" ON "Level"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Level_code_key" ON "Level"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SportTitle_name_key" ON "SportTitle"("name");

-- CreateIndex
CREATE INDEX "TextToNumberMapping_testType_idx" ON "TextToNumberMapping"("testType");

-- CreateIndex
CREATE UNIQUE INDEX "TextToNumberMapping_textValue_testType_key" ON "TextToNumberMapping"("textValue", "testType");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
