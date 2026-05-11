
export interface Product {
  id: string;
  created_at: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_urls: string[];
  discount?: number; // Percentage (0-100)
  colors?: string[]; // Array of available colors
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string; // The specific color user chose
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export const ADMIN_EMAILS = [
  'gibsoncollections1@gmail.com',
  'gibsoncollections2@gmail.com'
];

export const CATEGORY_CONFIG = [
  { name: 'Diapering & Daily Care', image: '/Diapers.jpg' },
  { name: 'Clothing & Accessories', image: '/Cloth.jpg' },
  { name: 'Feeding', image: '/Feed.jpg' },
  { name: 'Adult Wears', image: '/Adult.jpg' },
  { name: 'Nursery & Safety', image: '/Safe.jpg' },
];

export const CATEGORIES = [
  ...CATEGORY_CONFIG.map(c => c.name),
  'Others'
];

export const CATEGORY_IMAGES: Record<string, string> = CATEGORY_CONFIG.reduce((acc, curr) => ({
  ...acc,
  [curr.name]: curr.image
}), {});

export const WHATSAPP_NUMBER = '2348033464218';
