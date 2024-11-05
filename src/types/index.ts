export interface Collection {
  id: string;
  name: string;
  items: ShopItem[];
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  isPublic: boolean;
} 