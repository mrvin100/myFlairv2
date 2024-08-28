"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getBusinessBoosterById } from "@/data/business-booster";
import Cart from "@/components/shop/steps/reservation/cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Home from "@/components/shop/steps/reservation/Calendar/";
import { WorkplaceProvider } from "@/contexts/WorkplaceContext";
import { Post, ReservationStatus } from "@prisma/client";
import { Loader, Loader2 } from "lucide-react";
import { createReservation } from "@/lib/queries";
import { useUserContext } from "@/contexts/user";
import { useDateContext } from "@/contexts/dateContext";

interface Props {
  params: {
    slug: string;
  };
}


const ReservationStep = ({ params }: Props) => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const {slug: postId} = params;  // Getting the post Id
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { selectedWeekDays, selectedSaturdays, removeDate } = useDateContext();
  
  useEffect(() => {
    fetch(`/api/post/get/${postId}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        
        console.log(data.price);
        const {post} = data;
        setPost(post);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const handleSave = async () => {
    try {
      if (user && postId) {
        setIsSaving(true);
        const userId = user.id!;
        const promises = await createReservation(userId, parseInt(postId, 10), ReservationStatus.PENDING, post?.price!, [...selectedWeekDays, ...selectedSaturdays]);
        if (promises) {
          removeDate(undefined, undefined, true);
          router.push('/shop/steps/business-boosters');
        }
      }
    } catch (error) {
      setIsSaving(false);      
    }
  };
  
  if (loading) return (
  <div className="flex items-center justify-center h-screen">
    <Loader className="animate-spin h-5 w-5 text-gray-900" />
  </div>);

  else return (
    <WorkplaceProvider>
      {/* <DateProvider> */}
      <main className="flex flex-col items-center justify-center p-4">
        <img src="/logos/Rectangle_21.svg" alt="" />
        <h1 className="font-bold text-2xl flex items-center mb-4">
          Réserver votre Poste de Travail Flair
        </h1>
        <div className="flex flex-col lg:flex-row w-full justify-center items-center lg:items-start">
          <div className="w-full lg:w-1/2 p-4">
            <Home postId={postId} post={post}/>
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <Cart post={post}/>
            <div className="flex items-center justify-end mt-4">
              <Button className="mr-4" variant="secondary"disabled={isSaving}>
                Annuler
              </Button>
              {/* <Link href={"/shop/steps/business-boosters"}> */}
                <Button 
                  onClick={handleSave}
                  disabled={[...selectedWeekDays, ...selectedSaturdays].length === 0 || isSaving}
                >
                  {isSaving ? <Loader2 className="animate-spin h-5 w-5 text-white" /> : "Continuer"}
                </Button>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </main>
    </WorkplaceProvider>
  );
};

export default ReservationStep;
