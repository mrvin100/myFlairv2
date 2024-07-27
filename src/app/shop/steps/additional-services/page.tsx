import { Button } from "@/components/ui/button";
import { getAllAdditionalServices } from "@/data/additional-service";
import Image from "next/image";
import CartGlobal from "../../Cart";
import { Input } from "@/components/ui/input";
import ButtonServiceAdd from "@/components/shop/steps/reservation/ButtonServiceAdd/page";
import Link from "next/link";

export default async function AdditionalServices() {
  const additionalServices = (await getAllAdditionalServices()) || [];

  return (
    <main className=" h-screen w-screen p-4">
      <div className="flex justify-center items-center">
        <img style={{ width: "70%" }} src="/logos/Rectangle_21.svg" alt="" />
      </div>
      <h1 className="font-bold text-2xl  text-center">
        Il ne vous manques rien ?
      </h1>
      <div className=" mt-10 flex flex-col justify-center items-center ">
        {additionalServices.map((additionalService) => (
          <div key={additionalService.id} className="max-w-[700px]">
            <div className="flex">
              <Image
                className="w-1/2 rounded-l-md"
                src={additionalService.image}
                alt={"imageOfService"}
                width={1000}
                height={1000}
              />

              <div className="w-1/2 bg-gray-100 p-4 rounded-r-md">
                <h4 className="text-[24px] font-bold">
                  {additionalService.title}
                </h4>
                <h3 className="flex text-gray-400 text-[20px]">
                  {Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(additionalService.price)}{" "}
                  /{" "}
                  {additionalService.type === "day" && (
                    <h3 className="text-gray-400 text-[20px] ml-1">jours</h3>
                  )}
                </h3>
                <p className="text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
                  nemo assumenda asperiores alias perferendis voluptates est
                  officiis quas cum, repudiandae expedita recusandae consectetur
                  aperiam? Minus laboriosam vitae blanditiis a? Debitis.
                </p>
                {/*Utilisation d'un compoent client car utilisation de onWheel*/}
                <div className="flex justify-end">
                  <ButtonServiceAdd />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="mt-10">
          <h1 className="text-2xl font-bold">Panier</h1>
          <br />
          <CartGlobal />
        </div>
      </div>
      <div className="flex justify-end">
        <Link href={"/shop/steps/business-boosters"}>
          <Button className="mr-4" variant="secondary">
            Annuler
          </Button>
        </Link>
        <Link href={"/shop/steps/payment-form"}>
          <Button className="ml-4">Continuer</Button>
        </Link>
      </div>
    </main>
  );
}
