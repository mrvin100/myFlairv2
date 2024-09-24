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

export async function createReservation(
  userId: string,
  postId: number,
  status: ReservationStatus,
  selectedDates: string[]
) {
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Post non trouvé");

    const reservations = await Promise.all(
      selectedDates.map(async (date: string) => {
        const reservationDate = new Date(date);
        const isSaturday = reservationDate.getDay() === 6;
        const price = isSaturday ? Number(post.saturdayPrice) : Number(post.weekPrice);

        if (isNaN(price)) throw new Error("Prix invalide pour la date " + date);

        const reservation = await prisma.reservation.create({
          data: {
            userId: userId,
            postId: postId,
            date: reservationDate,
            price: price,
            status: status,
          },
        });
        return reservation;
      })
    );

    return reservations;
  } catch (error) {
    console.log("Erreur lors de la création des réservations:", error);
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