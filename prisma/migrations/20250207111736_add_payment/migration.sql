/*
  Warnings:

  - Added the required column `lessonContent` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Made the column `studentId` on table `lessons` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `teacherId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "lessonContent" TEXT NOT NULL,
ADD COLUMN     "payed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "teacherId" INTEGER NOT NULL,
ALTER COLUMN "studentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
