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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import axios from "axios";

interface Category {
  id: string;
  title: string;
  imageMinia: string;
  imageLogo: string;
}

const DisplayCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/get');
        console.log(response)
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };
    fetchCategories();
  }, []);

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      await axios.delete(`/api/categories/${selectedCategoryId}`);
      setCategories(categories.filter(category => category.id !== selectedCategoryId));
      setShowDialog(false);
      setSelectedCategoryId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie :", error);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Image Miniature</TableHead>
            <TableHead>Image du Logo</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.title}</TableCell>
              <TableCell>
                <img src={category.imageMinia} alt={category.title} style={{ width: '100px', height: 'auto' }} />
              </TableCell>
              <TableCell>
                <img src={category.imageLogo} alt={`${category.title} Logo`} style={{ width: '100px', height: 'auto' }} />
              </TableCell>
              <TableCell>
                <div className="flex">
                  <Link href={`/dashboard/administrator/client/${encodeURIComponent(category.id)}`}>
                    <img src="/iconWorkPlace/edit.svg" alt="Edit" />
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <img
                        src="/iconWorkPlace/trash-2.svg"
                        alt="Delete"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setShowDialog(true);
                        }}
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Voulez-vous vraiment supprimer cette catégorie ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible, voulez-vous vraiment la supprimer ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDialog(false)}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCategory}>Valider</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DisplayCategory;
