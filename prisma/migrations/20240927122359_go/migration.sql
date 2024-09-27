-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_postId_fkey";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
