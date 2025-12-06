-- Create Reciters Table
CREATE TABLE IF NOT EXISTS "reciters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "style" TEXT,
    "photoUrl" TEXT,
    "audioUrl" TEXT NOT NULL,
    "apiId" TEXT,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reciters_pkey" PRIMARY KEY ("id")
);

-- Create Books Table
CREATE TABLE IF NOT EXISTS "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "description" TEXT,
    "coverUrl" TEXT,
    "fileUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- Create User Downloads Table
CREATE TABLE IF NOT EXISTS "user_downloads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "localPath" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_downloads_pkey" PRIMARY KEY ("id")
);

-- Add ForeignKey for User Downloads
ALTER TABLE "user_downloads" ADD CONSTRAINT "user_downloads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
