'use client';
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input"; // Assure-toi que tu as importé le composant Input de Shadcn UI
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Assure-toi que tu as importé les composants Select de Shadcn UI

interface NewClient {
  id: string;
  lastName: string;
  firstName: string;
  nameOfSociety: string;
  image: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  password: string;
  role: string;
  homeServiceOnly: boolean; 
  billingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  preferences: {};
  createdAt: string;
}

const DisplayClients = () => {
  const [clients, setClients] = useState<NewClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<NewClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | 'all'>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${window.location.origin}/api/utilisateur/getAll`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: NewClient[]) => {
        console.log('Clients fetched:', data);
        setClients(data);
        setFilteredClients(data); // Initialement, tous les clients sont affichés
      })
      .catch(error => console.error('Error fetching clients', error));
  }, []);

  useEffect(() => {
    // Filtre les clients en fonction du terme de recherche et du rôle sélectionné
    const filtered = clients.filter(client => {
      const matchesSearchTerm = 
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.address.street + ' ' + client.address.city).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || client.role === selectedRole;

      return matchesSearchTerm && matchesRole;
    });

    setFilteredClients(filtered);
  }, [searchTerm, selectedRole, clients]);

  const handleDelete = async (id: string) => {
    try {
      await deleteClientById(id);
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
    }
  };

  async function deleteClientById(id: string) {
    const response = await fetch(`/api/clients/delete/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return response.json();
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Input 
          type="text" 
          placeholder="Rechercher par nom, prénom, adresse ou email" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <Select 
          onValueChange={setSelectedRole}
          value={selectedRole}
          className="mt-2"
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="ADMINISTRATOR">Administrateur</SelectItem>
            <SelectItem value="PROFESSIONAL">Professionel</SelectItem>
            <SelectItem value="PERSONAL">Particulier</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AlertDialog>
        <Table className="overflow-x-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-min-[500px] whitespace-nowrap overflow-hidden text-ellipsis">Nom & Prénom</TableHead>
              <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">Adresse</TableHead>
              <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">Numéro de téléphone</TableHead>
              <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">Email</TableHead>
              <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">Rôle</TableHead>
              <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">Date d'inscription</TableHead>
              <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">Action</TableHead>
            </TableRow>
          </TableHeader>
          {filteredClients.map((client) => (
            <TableBody key={client.id}>
              <TableRow>
                <TableCell className="w-min-[300px] text-center whitespace-nowrap overflow-hidden text-ellipsis">{`${client.firstName} ${client.lastName}`}</TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{`${client.address.street}, ${client.address.city}, ${client.address.postalCode}`}</TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{client.phone}</TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{client.email}</TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis"><span className="flex justify-center">{client.role || '-'}</span></TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {client.createdAt ? format(parseISO(client.createdAt), "eeee d MMMM yyyy", { locale: fr }) : '-'}
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <div className="flex">
                    <Link href={`/dashboard/administrator/client/${encodeURIComponent(client.id)}`}>
                      <img src="/iconWorkPlace/edit.svg" alt="Edit" />
                    </Link>
                    <AlertDialogTrigger asChild>
                      <img
                        className="ml-5"
                        src="/iconWorkPlace/trash-2.svg"
                        alt="Delete"
                        onClick={() => {
                          setShowDialog(true);
                          setSelectedClientId(client.id);
                        }}
                      />
                    </AlertDialogTrigger>
                  </div>
                  {showDialog && selectedClientId === client.id && (
                    <AlertDialogContent key={client.id}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Voulez-vous vraiment supprimer ce client ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible, voulez-vous vraiment le supprimer ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDialog(false)}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          handleDelete(client.id);
                          setShowDialog(false);
                        }}>
                          Valider
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </AlertDialog>
    </div>
  );
};

export default DisplayClients;
