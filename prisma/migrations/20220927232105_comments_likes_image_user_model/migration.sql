/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Image` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Comment_imageId_fkey` ON `Comment`;

-- DropIndex
DROP INDEX `Image_userId_idx` ON `Image`;

-- DropIndex
DROP INDEX `Like_imageId_fkey` ON `Like`;

-- DropIndex
DROP INDEX `Tag_imageId_fkey` ON `Tag`;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `createdAt`;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
