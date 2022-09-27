/*
  Warnings:

  - You are about to drop the `TagsOnImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TagsOnImage` DROP FOREIGN KEY `TagsOnImage_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `TagsOnImage` DROP FOREIGN KEY `TagsOnImage_tagId_fkey`;

-- DropTable
DROP TABLE `TagsOnImage`;
