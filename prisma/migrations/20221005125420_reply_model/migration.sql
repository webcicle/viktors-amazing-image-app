/*
  Warnings:

  - You are about to drop the column `commentId` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Reply` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[replyToId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `replyFromId` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Reply` DROP FOREIGN KEY `Reply_commentId_fkey`;

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `replyToId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Reply` DROP COLUMN `commentId`,
    DROP COLUMN `text`,
    ADD COLUMN `replyFromId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Comment_replyToId_key` ON `Comment`(`replyToId`);

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `Reply`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD CONSTRAINT `Reply_replyFromId_fkey` FOREIGN KEY (`replyFromId`) REFERENCES `Comment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
