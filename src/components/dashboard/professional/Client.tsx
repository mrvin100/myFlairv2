import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { CircleDot } from "lucide-react";
import Image from "next/image";

export default function Client({ typeClient = "boutique" }) {
  return (
    <div className="bg-white w-full border rounded-sm p-4">
      <div>
        <Image
          src={"/nail-salon.webp"}
          height={120}
          width={120}
          alt="client profile"
          className="rounded-full object-cover h-24 w-24 inline-block mr-4"
        />
        <div
          className={clsx(
            typeClient == "boutique"
              ? "bg-blue-100 text-blue-600"
              : "text-black-500 bg-gray-300",
            "rounded-sm py-2 px-3 text-[.7rem] w-auto inline-block"
          )}
        >
          Client {typeClient == "boutique" ? "en boutique" : "flair"}
        </div>
      </div>
      <div className="flex flex-auto">
        <ul className="text-sm text-gray-500 my-4 mx-auto flex flex-col gap-3">
          <li>
            <strong>Nom :</strong> Miss
          </li>
          <li>
            <strong>Prenom :</strong> Kitty
          </li>
          <li>
            <strong>Email :</strong> missKity@gmail.com
          </li>
          <li>
            <strong>Telephone :</strong>0033(0)6 02 03 03 05
          </li>
          <li>
            <strong>Adresse :</strong> 06 rue des alpes, 75016 Paris France
          </li>
        </ul>
      </div>
      <div className="flex gap-4 items-center flex-wrap justify-end">
        <Button variant={"outline"}>Supprimer</Button>
        <Button variant={"outline"}>Créer une réservation</Button>
        <Button variant={"outline"}>Consulter ses réservations</Button>
        <Button>Modifier</Button>
      </div>
    </div>
  );
}
