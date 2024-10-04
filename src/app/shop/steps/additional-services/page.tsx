import { Button } from "@/components/ui/button";
import { getAllAdditionalServices } from "@/data/additional-service";
import Image from "next/image";
import CartGlobal from "../../Cart";
import ButtonServiceAdd from "@/components/shop/steps/reservation/ButtonServiceAdd/page";
import Link from "next/link";
import CheckoutButton from "./CheckoutButton";
import { Separator } from "@/components/ui/separator";

export default async function AdditionalServices() {
  const additionalServices = (await getAllAdditionalServices()) || [];

  return (
    <main className="min-h-screen w-full">
      <div className="p-4 pb-12 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-center items-center">
          <img style={{ width: "70%" }} src="/logos/Rectangle_21.svg" alt="" />
        </div>
        <h1 className="text-2xl  text-center">Il ne vous manques rien ?</h1>
        <div className="mt-10 flex flex-col justify-center items-center ">
          {additionalServices.map((additionalService) => (
            <div key={additionalService.id}>
              <div className="flex flex-col md:flex-row max-w-md md:max-w-2xl">
                <Image
                  className="rounded-md md:rounded-l-md md:w-1/2 max-h-64 md:max-h-full"
                  src={additionalService.image}
                  alt={"imageOfService"}
                  width={1000}
                  height={1000}
                />

                <div className="md:w-1/2 bg-gray-100 p-4 rounded-r-md flex flex-col  justify-between items-center">
                  <div>
                    <h4 className="text-[24px] font-bold">
                      {additionalService.title}
                    </h4>
                    <h3 className="flex text-gray-400 text-[20px]">
                      {Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(additionalService.price)}{" "}
                      /{" "}
                      {(() => {
                        const typeLabels = {
                          day: "jour",
                          piece: "heure",
                          page: "page",
                        };
                        return (
                          <span className="text-gray-400 text-[20px] ml-1">
                            {typeLabels[additionalService.type] || ""}
                          </span>
                        );
                      })()}
                    </h3>
                    <p className="text-left">{additionalService.description}</p>
                  </div>
                  <div className="flex justify-end">
                    <ButtonServiceAdd service={additionalService} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-12" />
        <div>
          <CartGlobal className="w-full mx-auto my-6" />
        </div>
        <div className="flex justify-end">
          <Link href={"/shop/steps/business-boosters"}>
            <Button className="mr-4" variant="secondary">
              Annuler
            </Button>
          </Link>
          <CheckoutButton />
        </div>
      </div>
    </main>
  );
}
