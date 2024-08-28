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

  // Get all reservations for a user
  export async function getAllReservationsForUser(userId: string) {
    try {
      const reservations = await prisma.reservation.findMany({
        where: {
          userId: userId,
        },
      });
      return reservations;
    } catch (error) {
      console.log("Error fetching reservations:", error);
      return null;
    }
  }

  export const getPostById = async (id: number) => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: id,
        },
      });
      return post;
    } catch (error) {
      console.log("Error fetching post:", error);
      return null;
    }
  }