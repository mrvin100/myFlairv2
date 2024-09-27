import { getAllBusinessBoosters } from "@/data/business-booster";
import { getAllReservationsForUser, getPostById } from "@/lib/queries";

export async function getReservationsAndPost(userId: string) {
    const reservations = await getAllReservationsForUser(userId);
    if(!reservations) return []

    const reservationsPostsPromises = reservations.map(async (reservation) => {
        const post = await getPostById(reservation.postId);
        return { reservation, post };
    });

    const reservationsWithPosts = await Promise.all(reservationsPostsPromises);
    return reservationsWithPosts;
}

export async function getBusinessBoosters() {
    const businessBoosters = await getAllBusinessBoosters();
    return businessBoosters;
}