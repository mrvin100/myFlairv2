-- DropForeignKey
ALTER TABLE "ReviewResponse" DROP CONSTRAINT "ReviewResponse_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
