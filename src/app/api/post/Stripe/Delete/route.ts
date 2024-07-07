import { stripe } from "@/lib/stripe";

// Fonction pour récupérer tous les produits Stripe
export async function getAllProducts() {
  try {
    const products = await stripe.products.list();
    return products.data; // Retourne un tableau d'objets de produits
  } catch (error) {
    console.error('Erreur lors de la récupération des produits Stripe:', error);
    throw error;
  }
}

// Fonction pour trouver l'ID d'un produit par son nom
export async function findProductIdByName(productName: string) {
  try {
    const products = await getAllProducts();
    const product = products.find((p) => p.name === productName);

    if (!product) {
      throw new Error(`Produit avec le nom "${productName}" non trouvé.`);
    }

    return product.id; // Retourne l'ID du produit trouvé
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'ID du produit par nom:', error);
    throw error;
  }
}

// Exemple d'utilisation pour supprimer un produit par son nom
async function deleteProductByName(productName: string) {
  try {
    const productId = await findProductIdByName(productName);
    await deleteProduct(productId);
    console.log(`Produit "${productName}" supprimé avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppression du produit par nom:', error);
  }
}

// Exemple d'utilisation
const productNameToDelete = 'apagnan'; // Remplacez par le nom réel du produit
deleteProductByName(productNameToDelete);