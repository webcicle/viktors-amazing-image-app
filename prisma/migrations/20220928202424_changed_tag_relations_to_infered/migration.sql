/*
  Warnings:

  - You are about to drop the `ImageTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ImageTag` DROP FOREIGN KEY `ImageTag_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `ImageTag` DROP FOREIGN KEY `ImageTag_tagId_fkey`;

-- DropTable
DROP TABLE `ImageTag`;

-- CreateTable
CREATE TABLE `_ImageToTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ImageToTag_AB_unique`(`A`, `B`),
    INDEX `_ImageToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ImageToTag` ADD CONSTRAINT `_ImageToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ImageToTag` ADD CONSTRAINT `_ImageToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
