export interface Stamp {
  id: string;
  name: string;
  country: string;
  year: number;
  theme: string;
  condition: 'mint' | 'used' | 'damaged';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  images: string[];
  description?: string;
  collectionId?: string;
  tags: string[];
  catalogNumber?: string;
  denomination?: string;
  printRun?: number;
  isSold?: boolean;
  salePrice?: number;
  saleDate?: string;
  buyer?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  theme: string;
  stamps: Stamp[];
  totalValue: number;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpendLimit {
  id: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  limit: number;
  spent: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Sale {
  id: string;
  stampId: string;
  salePrice: number;
  saleDate: string;
  buyer: string;
  profit: number;
  stampName: string;
  stampImages: string[];
}

export interface UserAccount {
  id: string;
  email: string;
  tier: 'free' | 'premium';
  stampsQuota: number;
  stampsUsed: number;
  collectionsQuota: number;
  collectionsUsed: number;
  imagesQuota: number;
  imagesUsed: number;
}