/*
  Warnings:

  - You are about to alter the column `caption` on the `Image` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5000)` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE `Follows` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Image` MODIFY `caption` VARCHAR(500) NOT NULL;

-- CreateTable
CREATE TABLE `Flame` (
    `id` VARCHAR(191) NOT NULL,
    `imageId` VARCHAR(191) NOT NULL,
    `flamerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flame` ADD CONSTRAINT `Flame_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flame` ADD CONSTRAINT `Flame_flamerId_fkey` FOREIGN KEY (`flamerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
