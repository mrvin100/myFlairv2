"use client"

import { useState } from 'react'
import { Separator } from "@/components/ui/separator"

import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTbaleProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  columns, data,
}: DataTbaleProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >{
                  row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>))
                }
                <TableCell>
                  <OrderDetailsPage />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>No results.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

type Order = {
  order: string
  date: string
  status: "En cours" | "Annulée" | "Complète"
  total: string
  action?: string
}

const orders: Order[] = [
  {
    order: "n°23074",
    date: "23 février 2024",
    status: "En cours",
    total: "119,94 € pour 6 articles",
  },
  {
    order: "n°23061",
    date: "26 janvier 2024",
    status: "Annulée",
    total: "129,94 € pour 6 articles",
  }
]

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order",
    header: "Commande",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "État",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "action",
    header: "Actions",
  },
]

export default function OrdersTab() {
  return (
    <TabsContent value="orders" className="space-y-4">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <h2 className="text-2xl font-normal tracking-tight">Mes Commandes</h2>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={orders} />
        </div>
      </div>
    </TabsContent>
  );
}



// Order details function

function OrderDetailsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <Button className='rounded-[1.3rem]' onClick={() => setOpen(true)}>Voir</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-[90%] scroll-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal">Mes commandes</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 ">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="font-semibold">NUMÉRO de commande :</p>
                <p>#001</p>
              </div>
              <div>
                <p className="font-semibold">DATE :</p>
                <p>23 mars 2024</p>
              </div>
              <div>
                <p className="font-semibold">Email :</p>
                <p>mon@email.com</p>
              </div>
              <div>
                <p className="font-semibold">TOTAL :</p>
                <p>2000 €</p>
              </div>
              <div>
                <p className="font-semibold">Mode de paiement :</p>
                <p>carte bleue</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold bg-gray-100 p-2">Détails de la commande</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Produit</TableHead>
                    <TableHead className="font-semibold">Date de réservation</TableHead>
                    <TableHead className="font-semibold">Qtés</TableHead>
                    <TableHead className="font-semibold">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Location Poste Coiffure & make up</TableCell>
                    <TableCell>
                      04.06.2024 <br />
                      06.06.2024 <br />
                      07.06.2024
                    </TableCell>
                    <TableCell>
                      1 <br />
                      1 <br />
                      1
                    </TableCell>
                    <TableCell>
                      70 € <br />
                      45 € <br />
                      30 € <br />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Formation lissage</TableCell>
                    <TableCell>07.06.2024</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>30 €</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Fer à lisser</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>30 €</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="font-semibold text-left">Total</TableCell>
                    <TableCell className="font-semibold">2000 €</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold bg-gray-100 p-2">Adresse de facturation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <p><span className="font-semibold">Nom de la société :</span></p>
                  <p><span className="font-semibold">Prénom et nom :</span></p>
                  <p><span className="font-semibold">Num et rue :</span></p>
                  <p><span className="font-semibold">Code postal :</span></p>
                  <p><span className="font-semibold">Téléphone :</span></p>
                  <p><span className="font-semibold">Email :</span></p>
                </div>
                <div className="space-y-2">
                  {/* Les valeurs seront ajoutées ici */}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex space-x-4 justify-end">
              <Button variant="secondary" onClick={() => setOpen(false)}>Retour</Button>
              <Button>Télécharger la facture</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}