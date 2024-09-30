import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Search,
  Trash,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrderDetails from "./order-details";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrderList() {
  enum OrderStatus {
    EN_COURS = "En cours",
    ANNULE = "Annulé",
    EN_ATTENTE = "Attente de paiement",
    REMBOURSE = "Remboursée",
    TERMINE = "Terminée",
  }
  const initialOrders = [
    {
      id: "1",
      order_number: "#001",
      client: "Séraphine Manille",
      order_date: "20 Janvier 2024",
      total: "298€",
      etat: OrderStatus.EN_COURS,
    },
    {
      id: "2",
      order_number: "#002",
      client: "Lili  Dilialt",
      order_date: "21 Janvier 2024",
      total: "450€",
      etat: OrderStatus.EN_ATTENTE,
    },
    {
      id: "3",
      order_number: "#003",
      client: "Michel Vierra",
      order_date: "16 Janvier 2024",
      total: "1000€",
      etat: OrderStatus.TERMINE,
    },
    {
      id: "4",
      order_number: "#004",
      client: "Michel Vierra",
      order_date: "13 Janvier 2024",
      total: "350€",
      etat: OrderStatus.TERMINE,
    },
  ];
  const [orders, setOrders] = React.useState(initialOrders);
  const [selectedStatus, setSelectedStatus] = React.useState("");

  function handleDeleteSubsciption(id: string) {
    const filteredDatas = orders.filter((order) => order.id !== id);
    setOrders(filteredDatas);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold my-8 text-center">
        Commandes Clients
      </h3>
      <div className="my-6 flex justify-between items-center gap-3">
        <Select onValueChange={(value) => setSelectedStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous</SelectItem>
            <SelectItem value={OrderStatus.EN_COURS}>En cours</SelectItem>
            <SelectItem value={OrderStatus.ANNULE}>Annulé</SelectItem>
            <SelectItem value={OrderStatus.EN_ATTENTE}>
              Attente de paiement
            </SelectItem>
            <SelectItem value={OrderStatus.REMBOURSE}>Remboursée</SelectItem>
            <SelectItem value={OrderStatus.TERMINE}>Terminée</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une commande..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold">N° de commande</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Date de la commande</TableHead>
            <TableHead className="font-semibold">Total</TableHead>
            <TableHead className="font-semibold">État</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders && orders.length > 0 ? (
            (selectedStatus === "tous" || selectedStatus === ""
              ? orders
              : orders.filter((order) => order.etat === selectedStatus)
            ).map((order) => (
              <TableRow key={order?.id}>
                <TableCell className="font-semibold">
                  {order?.order_number}
                </TableCell>
                <TableCell className="font-semibold">{order?.client}</TableCell>
                <TableCell>{order?.order_date}</TableCell>
                <TableCell>{order?.total}</TableCell>
                <TableCell>{order?.etat}</TableCell>
                <TableCell>
                  <Button variant={"ghost"} size={"icon"}>
                    <Edit className="h-4 w-4 mr-2" />
                  </Button>
                  &nbsp;
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => handleDeleteSubsciption(order?.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                  </Button>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant={"outline"} className="rounded-full">
                        voir
                      </Button>
                    </DialogTrigger>
                    <DialogContent  className="max-w-2xl md:max-w-5xl w-full">
                      <DialogTitle>Détails Commande {order.order_number}</DialogTitle>
                      <ScrollArea className="max-h-[28rem] md:max-h-[36rem] rounded-md">
                        <OrderDetails order={order} />
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center border" colSpan={8}>
                Aucune commande client présente.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
