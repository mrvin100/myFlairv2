import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function OrderDetails({ order }) {
  return (
    <section className="">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-start my-3  text-sm">
        <ul className="space-y-2">
          <li>
            <h3>Date de création : </h3>{" "}
            <p className="text-muted-foreground">{order?.order_date}</p>
          </li>
          <li>
            <h3>État </h3>{" "}
            <p className="text-muted-foreground">{order?.etat}</p>
          </li>
        </ul>
        <ul className="space-y-2">
          <li>
            <h3>Client : </h3>{" "}
            <p className="text-muted-foreground">
              {order?.client}, 11 avenue de saint Antoine 13015 Marseille
            </p>
          </li>
          <li>
            <h3>Email : </h3>{" "}
            <p className="text-muted-foreground">seraph@bmail.com</p>
          </li>
          <li>
            <h3>Téléphone : </h3>{" "}
            <p className="text-muted-foreground">seraph@bmail.com</p>
          </li>
          <li>
            <h3>Email : </h3>{" "}
            <p className="text-muted-foreground">+33 (0) 6 06 60 60 60</p>
          </li>
          <Button>Voir plus</Button>
        </ul>
        <ul className="space-y-2">
          <li>
            <h3>Facturation : </h3>{" "}
            <p className="text-muted-foreground">
              Séraphine Manille, 11 avenue de saint Antoine 13015 Marseille
            </p>
          </li>
          <li>
            <h3>Email : </h3>{" "}
            <p className="text-muted-foreground">seraph@bmail.com</p>
          </li>
          <li>
            <h3>Téléphone : </h3>{" "}
            <p className="text-muted-foreground">seraph@bmail.com</p>
          </li>
          <li>
            <h3>Email : </h3>{" "}
            <p className="text-muted-foreground">+33 (0) 6 06 60 60 60</p>
          </li>
          <Button>Envoyer la facture</Button>
        </ul>
      </div>
      <Table className="my-6">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold">Article</TableHead>
            <TableHead className="font-semibold">Côut</TableHead>
            <TableHead className="font-semibold">Qté</TableHead>
            <TableHead className="font-semibold">
              Dates de réservations
            </TableHead>
            <TableHead className="font-semibold">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">
              Poste coiffure & make up
            </TableCell>
            <TableCell>70€</TableCell>
            <TableCell>2 Jours</TableCell>
            <TableCell>
              <span>21 Janvier 2024</span> <br />
              <span>24 Janvier 2024</span>{" "}
            </TableCell>
            <TableCell>140€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Formation Lissage</TableCell>
            <TableCell>100€</TableCell>
            <TableCell>1</TableCell>
            <TableCell>15 février 2024</TableCell>
            <TableCell>200€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Service impression</TableCell>
            <TableCell>0.20€</TableCell>
            <TableCell>10 Pages</TableCell>
            <TableCell>-</TableCell>
            <TableCell>2€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell>Sous-total des articles :</TableCell>
            <TableCell>342€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell>Code(s) promo : - 10% ANNEE-2024</TableCell>
            <TableCell>-34.20€</TableCell>
          </TableRow>
          <TableRow className="bg-gray-100">
            <TableCell colSpan={3}></TableCell>
            <TableCell>Total de la commande:</TableCell>
            <TableCell>307.80€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>Paiement via :</TableCell>
            <TableCell>Stripe / Paypal</TableCell>
            <TableCell>N° de transaction: 021202145</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>Documents téléchargés</TableCell>
            <TableCell>3/3</TableCell>
            <TableCell>
              <Button className="rounded-full">Voir les documents</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div>
        <h2 className="my-6">Note sur la commande : </h2>
        <Textarea
          value={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet risus urna. Aenean gravida quam sit amet nunc tincidunt, non semper lorem laoreet. Sed a nunc turpis. Vivamus sed efficitur metus. Aenean et nulla a magna consectetur vehicula a et massa. Sed sed purus sem. Maecenas nulla neque, accumsan a lacus mattis, fermentum pulvinar turpis."
          }
          rows={5}
        />
        <div className="flex justify-end gap-3 items-center mt-3">
          <Button variant={"secondary"}>Annuler</Button>
          <Button variant={"ghost"}>Mettre à jour</Button>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="text-right">
        <Button variant={"destructive"}>
          Supprimer la commande
        </Button>
      </div>
    </section>
  );
}
