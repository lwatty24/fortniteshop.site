interface BundleItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  image: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  rarity: string;
  price: number;
  image: string;
  featuredImage?: string;
  type: string;
  isFortnitemares: boolean;
  added?: string;
  set?: string;
  series?: string;
  isJamTrack?: boolean;
  previewAudio?: string | null;
  history: {
    firstSeen: string;
    lastSeen: string;
    occurrences: number;
  };
  isBundle?: boolean;
  bundleItems?: BundleItem[];
  isFestivalGear?: boolean;
  battlepass?: boolean;
}

export interface ShopSection {
  name: string;
  items: ShopItem[];
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  items: ShopItem[];
  createdAt: number;
  userId: string;
  isPublic: boolean;
  shareId?: string;
}