import { ShopItem } from '../types';

interface StructuredDataProps {
  item: ShopItem;
}

export function StructuredData({ item }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": item.name,
    "description": item.description,
    "image": item.image,
    "brand": {
      "@type": "Brand",
      "name": "Fortnite"
    },
    "offers": {
      "@type": "Offer",
      "price": item.price,
      "priceCurrency": "VBucks",
      "availability": "https://schema.org/InStock"
    },
    "category": item.type,
    "itemCondition": "https://schema.org/NewCondition"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 