-- CreateTable
CREATE TABLE "SiteDiary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Weather" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteDiaryId" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Weather_siteDiaryId_fkey" FOREIGN KEY ("siteDiaryId") REFERENCES "SiteDiary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteDiaryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Attendee_siteDiaryId_fkey" FOREIGN KEY ("siteDiaryId") REFERENCES "SiteDiary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteDiaryId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    CONSTRAINT "Attachment_siteDiaryId_fkey" FOREIGN KEY ("siteDiaryId") REFERENCES "SiteDiary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Weather_siteDiaryId_key" ON "Weather"("siteDiaryId");
