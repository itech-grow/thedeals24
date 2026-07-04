export interface StorePrice {
  name: string;      // e.g., "Amazon", "Flipkart", "Croma", "Reliance Digital"
  price: number;     // Current price
  oldPrice: number;  // Previous price for comparisons
  url: string;       // Affiliate link
  couponCode?: string;
}

export interface PricePoint {
  date: string;      // e.g., "2026-06-01"
  price: number;     // Average across stores
}

export interface Product {
  id: string;
  name: string;
  category: 'electronics' | 'fashion' | 'travel' | 'grocery' | 'software' | 'others';
  subcategory: string; // e.g., "Mobiles", "Laptops", "TVs", "Accessories", "Men", "Women", "Kids"
  rating: number;
  reviewCount: number;
  image: string;       // Base64 or elegant SVG icon descriptive identifier
  stores: StorePrice[];
  priceHistory: PricePoint[];
  pros: string[];
  cons: string[];
  aiReview?: string;
  description: string;
  featured: boolean;
  todayDeal: boolean;
  priceDropToday: boolean;
  brand: string;
}

export interface Coupon {
  id: string;
  store: string;      // e.g., "Amazon", "Flipkart", "Croma", "Hostinger", "Hostgator"
  code: string;
  discount: string;   // e.g., "10% OFF", "₹500 OFF"
  description: string;
  expiry: string;
}

export interface TravelOffer {
  id: string;
  type: 'flight' | 'hotel' | 'package' | 'visa' | 'insurance';
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  destination: string;
  imageUrl: string;
}

export interface CreditCardOffer {
  id: string;
  bank: string;
  cardName: string;
  benefits: string[];
  annualFee: string;
  offer: string;
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
}

export interface BuyingGuide {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  savedAt: string;
  targetPrice?: number;
}

export interface AlertSubscription {
  id: string;
  email: string;
  category?: string;
  productId?: string;
  productName?: string;
  targetPrice: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AffiliateDeal {
  id: string;
  advertiser: string;
  targetedCountries?: string;
  linkId?: string;
  name: string;
  description: string;
  keywords?: string;
  linkType?: string;
  threeMonthEpc?: string;
  sevenDayEpc?: string;
  lastUpdated?: string;
  htmlLinks?: string;
  javascriptLinks?: string;
  clickUrl: string;
  promotionType?: string;
  couponCode?: string;
  promotionalDate?: string;
  promotionalEndDate?: string;
  category: string;
  advCid?: string;
  relationshipStatus?: string;
  language?: string;
  mobileOptimized?: string;
}
