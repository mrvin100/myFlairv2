// queries.ts
"use server";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";

export async function getReservationsForPost(postId: number) {
  const reservations = await prisma.reservation.findMany({
    where: {
      postId: postId,
    },
  });
  return reservations;
}

export async function createReservation(userId: string, postId: number, status: ReservationStatus, price: number, selectedDates: string[]) {

    try {
        const reservations = await Promise.all(
            selectedDates.map(async (date: string) => {
              // Calculate the price based on the selected date and post information (similar to before)
              const post = await prisma.post.findUnique({ where: { id: postId } });
              if (!post) {
                throw new Error("Post not found");
              }
              const dayOfWeek = new Date(date).getDay();
              const price = dayOfWeek === 6 ? parseFloat(post.saturdayPrice) : parseFloat(post.weekPrice);
    
              const reservation = await prisma.reservation.create({
                data: {
                  userId: userId,
                  postId: postId,
                  date: new Date(date),
                  price: price,
                  status: status,
                },
              });
              return reservation;
            })
          );
    
          return reservations;
    } catch (error) {
        console.log("Error creating reservations:", error);
        return null;
    }
  }

  export async function getReservationCountForPostAndDate(postId: number, date: Date) {
    const count = await prisma.reservation.count({
      where: {
        postId: postId,
        date: date,
      },
    });
    return count;
  }
