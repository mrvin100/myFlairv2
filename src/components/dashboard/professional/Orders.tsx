"use client"

import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTbaleProps<TData, TValue>{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  columns, data,
}: DataTbaleProps<TData, TValue>){
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
                    ?null
                    :flexRender(
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
                  <Button className='rounded-[1.3rem]'>Voir</Button>
                </TableCell>
              </TableRow>
            ))
          ): (
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
  } ,
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


// Commande
// Date
// État
// Total
// Actions

// n°23074
// 23 février 2024
// En cours
// 119,94 € pour 6 articles
// Voir

// n°23061
// 26 janvier 2024
// Annulée
// 129,94 € pour 6 articles
// Voir

export default function OrdersTab() {
  return (
    <TabsContent value="orders" className="space-y-4">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <h2 className="text-2xl font-normal tracking-tight">Mes Commandes</h2>
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={orders} />
          </div>
      </div>
    </TabsContent>
  );
}
