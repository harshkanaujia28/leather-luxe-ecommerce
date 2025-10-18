// utils/checkOffer.js
export const checkOfferStatus = (product) => {
  if (!product.offer) return product;

  const now = new Date();

  // Agar offer khatam ho chuka hai to inactive
  if (
    (product.offer.endDate && new Date(product.offer.endDate) < now) ||
    (product.offer.maxUses && product.offer.usedCount >= product.offer.maxUses)
  ) {
    product.offer.isActive = false;
  } else {
    product.offer.isActive = true;
  }

  return product;
};
