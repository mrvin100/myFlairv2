import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Tab } from "@mui/material"

const reservations = [
    {
        id:1,
        date: '',
        horaireDebut:'08h30',
        horaireFin:'19h00',
        tarif: 60,
    }
]


// C'est le cart temporaires pour les postes, on place les produit en useState dedans et quand on clique sur continuer on les envoi dans le cart global





const Cart = () => {
    return(
        <div>

    <Table>
        <TableCaption>Vos dates de réservations</TableCaption>
        <TableHeader className="bg-black">
            <TableRow  className="text-lg  bg-black">
           
                <TableHead className="text-center"style={{color:'#FFFFFF'}}>Date</TableHead>
                <TableHead className="text-center"style={{color:'#FFFFFF'}}>Horaires</TableHead>
                <TableHead className="text-center" style={{color:'#FFFFFF'}}>Tarifs</TableHead>
                <TableHead className="text-right" style={{color:'#FFFFFF'}}>Actions</TableHead>

            </TableRow>
        </TableHeader>
        {reservations.map((reservation) => (
            <TableBody key={reservation.id}>
                <TableRow>
                    
                    <TableCell><span className="flex justify-center">{reservation.date}</span></TableCell>
                    <TableCell><span className="flex justify-center">{reservation.horaireDebut} à {reservation.horaireFin}</span></TableCell>
                    <TableCell><span className="flex justify-center">{reservation.tarif} €</span></TableCell>
                    <TableCell className="text-right"><span className="flex justify-end"><img src={'/iconWorkPlace/trash-2.svg'} alt="" /></span></TableCell>
                 
                </TableRow>
                <TableRow>
                <TableCell><span className="flex justify-center">Total</span></TableCell>
                <TableCell><span className="flex justify-center"></span></TableCell>
                <TableCell><span className="flex justify-center"></span></TableCell>
                <TableCell className="text-right"><span className="flex justify-end">60€</span></TableCell>
                </TableRow>
            </TableBody>
        ))}
        
 

    </Table>
<br />
</div>
    )
}

export default Cart