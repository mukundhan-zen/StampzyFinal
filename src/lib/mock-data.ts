import { Stamp, Collection, SpendLimit, Sale, UserAccount } from '@/types/stamp';

export const mockStamps: Stamp[] = [
  {
    id: '1',
    name: 'Queen Elizabeth II Coronation',
    country: 'United Kingdom',
    year: 1953,
    theme: 'Royal',
    condition: 'mint',
    rarity: 'uncommon',
    purchasePrice: 45.00,
    currentValue: 120.00,
    purchaseDate: '2023-01-15',
    images: ['/stamps/uk-coronation-1953.jpg', '/stamps/uk-coronation-1953-back.jpg'],
    description: 'First day cover of Queen Elizabeth II coronation stamp in excellent condition',
    tags: ['royal', 'coronation', 'first-day-cover'],
    catalogNumber: 'SG 532',
    denomination: '4d',
    printRun: 308000000,
    collectionId: 'col-1'
  },
  {
    id: '2',
    name: 'Inverted Jenny',
    country: 'United States',
    year: 1918,
    theme: 'Aviation',
    condition: 'used',
    rarity: 'legendary',
    purchasePrice: 1200000.00,
    currentValue: 1350000.00,
    purchaseDate: '2022-08-20',
    images: ['/stamps/inverted-jenny.jpg'],
    description: 'One of the most famous error stamps in philatelic history',
    tags: ['error', 'aviation', 'airmail'],
    catalogNumber: 'C3a',
    denomination: '24¢',
    printRun: 100,
    collectionId: 'col-2'
  },
  {
    id: '3',
    name: 'Penny Black',
    country: 'United Kingdom',
    year: 1840,
    theme: 'Classic',
    condition: 'used',
    rarity: 'rare',
    purchasePrice: 3500.00,
    currentValue: 4200.00,
    purchaseDate: '2023-03-10',
    images: ['/stamps/penny-black.jpg', '/stamps/penny-black-detail.jpg'],
    description: 'The world\'s first adhesive postage stamp',
    tags: ['classic', 'historic', 'first-stamp'],
    catalogNumber: 'SG 1',
    denomination: '1d',
    collectionId: 'col-1'
  },
  {
    id: '4',
    name: 'Blue Mauritius',
    country: 'Mauritius',
    year: 1847,
    theme: 'Classic',
    condition: 'mint',
    rarity: 'legendary',
    purchasePrice: 950000.00,
    currentValue: 1100000.00,
    purchaseDate: '2021-11-05',
    images: ['/stamps/blue-mauritius.jpg'],
    description: 'One of the rarest stamps in the world',
    tags: ['rare', 'colonial', 'classic'],
    catalogNumber: 'SG 4',
    denomination: '2d',
    collectionId: 'col-2',
    isSold: true,
    salePrice: 1050000.00,
    saleDate: '2024-01-15',
    buyer: 'Private Collector'
  },
  {
    id: '5',
    name: 'Dragon Stamp',
    country: 'China',
    year: 1878,
    theme: 'Asian',
    condition: 'used',
    rarity: 'very-rare',
    purchasePrice: 15000.00,
    currentValue: 22000.00,
    purchaseDate: '2023-06-20',
    images: ['/stamps/china-dragon.jpg'],
    description: 'First postage stamp issued by Imperial China',
    tags: ['china', 'dragon', 'imperial'],
    catalogNumber: 'SG 1',
    denomination: '1ca',
    collectionId: 'col-3'
  }
];

export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'British Empire Classics',
    description: 'A comprehensive collection of classic British Empire stamps',
    theme: 'British Empire',
    stamps: mockStamps.filter(stamp => stamp.collectionId === 'col-1'),
    totalValue: 4320.00,
    totalPaid: 3545.00,
    createdAt: '2023-01-10',
    updatedAt: '2024-01-20'
  },
  {
    id: 'col-2',
    name: 'World Rarities',
    description: 'Ultra-rare stamps from around the world',
    theme: 'Rarities',
    stamps: mockStamps.filter(stamp => stamp.collectionId === 'col-2'),
    totalValue: 1350000.00,
    totalPaid: 1200000.00,
    createdAt: '2021-05-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'col-3',
    name: 'Asian Heritage',
    description: 'Stamps representing Asian postal history',
    theme: 'Asian',
    stamps: mockStamps.filter(stamp => stamp.collectionId === 'col-3'),
    totalValue: 22000.00,
    totalPaid: 15000.00,
    createdAt: '2023-06-15',
    updatedAt: '2023-12-20'
  }
];

export const mockSpendLimits: SpendLimit[] = [
  {
    id: 'sl-1',
    period: 'monthly',
    limit: 2000.00,
    spent: 1450.00,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    isActive: true
  },
  {
    id: 'sl-2',
    period: 'quarterly',
    limit: 5000.00,
    spent: 3200.00,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    isActive: true
  },
  {
    id: 'sl-3',
    period: 'yearly',
    limit: 20000.00,
    spent: 8750.00,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true
  }
];

export const mockSales: Sale[] = [
  {
    id: 'sale-1',
    stampId: '4',
    salePrice: 1050000.00,
    saleDate: '2024-01-15',
    buyer: 'Private Collector',
    profit: 100000.00,
    stampName: 'Blue Mauritius',
    stampImages: ['/stamps/blue-mauritius.jpg']
  }
];

export const mockUserAccount: UserAccount = {
  id: 'user-1',
  email: 'collector@example.com',
  tier: 'premium',
  stampsQuota: 10000,
  stampsUsed: 347,
  collectionsQuota: 100,
  collectionsUsed: 12,
  imagesQuota: 50000,
  imagesUsed: 1247
};