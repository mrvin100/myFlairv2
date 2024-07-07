import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
  typescript: true,
});
export async function deleteProduct(productId: string) {
  try {
    const deletedProduct = await stripe.products.del(productId);
    console.log(`Produit ${productId} supprimé avec succès dans Stripe.`);
    return deletedProduct;
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${productId} dans Stripe:`, error);
    throw error;
  }
}