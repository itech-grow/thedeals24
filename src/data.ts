import { Product, Coupon, TravelOffer, CreditCardOffer, BlogPost, BuyingGuide } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Laptops
  {
    id: 'lap-01',
    name: 'Dell Inspiron 15 3520 Laptop',
    category: 'electronics',
    subcategory: 'Laptops',
    brand: 'Dell',
    rating: 4.5,
    reviewCount: 428,
    image: '💻',
    description: 'Intel Core i5 12th Gen processor, 16GB RAM, 512GB SSD, 15.6" FHD 120Hz display, Windows 11 Home + MS Office 2021. Sleek carbon black design.',
    stores: [
      { name: 'Amazon', price: 52490, oldPrice: 62000, url: 'https://amazon.in/dp/dell-inspiron-15', couponCode: 'SAVE1000' },
      { name: 'Flipkart', price: 51990, oldPrice: 61500, url: 'https://flipkart.com/dell-inspiron-15' },
      { name: 'Croma', price: 53200, oldPrice: 63000, url: 'https://croma.com/p/dell-inspiron-15' },
      { name: 'Reliance Digital', price: 52999, oldPrice: 62500, url: 'https://reliancedigital.in/p/dell-inspiron-15' }
    ],
    priceHistory: [
      { date: '2026-01-01', price: 59000 },
      { date: '2026-02-01', price: 58000 },
      { date: '2026-03-01', price: 56500 },
      { date: '2026-04-01', price: 55000 },
      { date: '2026-05-01', price: 53500 },
      { date: '2026-06-01', price: 51990 }
    ],
    pros: [
      'Excellent 120Hz smooth refresh rate screen',
      'Solid performance with 12th Gen Intel Core i5',
      'Generous 16GB RAM is perfect for multitasking',
      'Comfortable keyboard and lightweight build'
    ],
    cons: [
      'Webcam resolution is only 720p and average',
      'Build material is plastic, lacks a premium metal feel',
      'Average battery life of around 4-5 hours'
    ],
    aiReview: 'The Dell Inspiron 15 offers outstanding performance for everyday office tasks, programming, and moderate multitasking. The 120Hz display is a major highlight, keeping the interface fluid. However, battery backup and plastic construction are compromises you make for this competitive price point.',
    featured: true,
    todayDeal: true,
    priceDropToday: true
  },
  {
    id: 'lap-02',
    name: 'MacBook Air M2 Chip (8GB/256GB SSD)',
    category: 'electronics',
    subcategory: 'Laptops',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 1542,
    image: '🍎💻',
    description: 'Apple M2 chip with 8‑core CPU and 8‑core GPU, 13.6-inch Liquid Retina Display, 8GB Unified Memory, 256GB SSD storage, Backlit Magic Keyboard, Touch ID.',
    stores: [
      { name: 'Amazon', price: 89900, oldPrice: 99900, url: 'https://amazon.in/dp/macbook-air-m2', couponCode: 'MACBOOKAIR3K' },
      { name: 'Flipkart', price: 88490, oldPrice: 99900, url: 'https://flipkart.com/macbook-air-m2' },
      { name: 'Croma', price: 89500, oldPrice: 99900, url: 'https://croma.com/p/macbook-air-m2' },
      { name: 'Reliance Digital', price: 89900, oldPrice: 99900, url: 'https://reliancedigital.in/p/macbook-air-m2' }
    ],
    priceHistory: [
      { date: '2026-01-01', price: 95000 },
      { date: '2026-02-01', price: 94000 },
      { date: '2026-03-01', price: 92000 },
      { date: '2026-04-01', price: 91000 },
      { date: '2026-05-01', price: 89900 },
      { date: '2026-06-01', price: 88490 }
    ],
    pros: [
      'Unmatched battery life of up to 15-18 hours',
      'Ultra-thin, light, and fanless silent operation',
      'Beautiful Liquid Retina screen with high brightness',
      'Superb speakers and top-tier trackpad'
    ],
    cons: [
      'Base model is limited to 8GB unified memory, non-upgradeable',
      'Only supports one external monitor natively',
      'Heavier workloads cause thermal throttling due to no fan'
    ],
    aiReview: 'The M2 MacBook Air remains the best premium ultraportable laptop. It is perfect for writers, programmers, students, and light creators who value battery life, absolute silence, and design. For heavy video editing, look at the MacBook Pro with active fan cooling.',
    featured: true,
    todayDeal: false,
    priceDropToday: false
  },
  // Mobiles
  {
    id: 'mob-01',
    name: 'Samsung Galaxy S24 Ultra 5G',
    category: 'electronics',
    subcategory: 'Mobiles',
    brand: 'Samsung',
    rating: 4.8,
    reviewCount: 945,
    image: '📱',
    description: 'Titanium Gray, 12GB RAM, 256GB Storage, Snapdragon 8 Gen 3, Quad Rear Camera (200MP + 50MP + 12MP + 10MP), 120Hz Dynamic AMOLED display, S-Pen included.',
    stores: [
      { name: 'Amazon', price: 119999, oldPrice: 129999, url: 'https://amazon.in/dp/samsung-s24-ultra', couponCode: 'SAMSUNG5K' },
      { name: 'Flipkart', price: 118499, oldPrice: 129999, url: 'https://flipkart.com/samsung-s24-ultra' },
      { name: 'Croma', price: 119900, oldPrice: 129999, url: 'https://croma.com/p/samsung-s24-ultra' },
      { name: 'Reliance Digital', price: 119500, oldPrice: 129999, url: 'https://reliancedigital.in/p/samsung-s24-ultra' }
    ],
    priceHistory: [
      { date: '2026-01-01', price: 129999 },
      { date: '2026-02-01', price: 127000 },
      { date: '2026-03-01', price: 125000 },
      { date: '2026-04-01', price: 122000 },
      { date: '2026-05-01', price: 120000 },
      { date: '2026-06-01', price: 118499 }
    ],
    pros: [
      'Top-of-the-line zoom capabilities with 200MP sensor',
      'Premium, durable Titanium build and flat display',
      'Seven years of software updates from Samsung',
      'Excellent performance and S-Pen utility'
    ],
    cons: [
      'Very expensive and heavy to carry',
      'Charging speed capped at 45W (charger not in box)',
      'Aggressive anti-reflective coating reduces screen saturation slightly'
    ],
    aiReview: 'Samsung Galaxy S24 Ultra is the ultimate Android powerhouse. It is packed with productive Galaxy AI features, an incredible zoom camera, and long-lasting durability. Truly a laptop replacement in your pocket, though expensive.',
    featured: true,
    todayDeal: true,
    priceDropToday: true
  },
  {
    id: 'mob-02',
    name: 'OnePlus 12R 5G (16GB/256GB)',
    category: 'electronics',
    subcategory: 'Mobiles',
    brand: 'OnePlus',
    rating: 4.6,
    reviewCount: 712,
    image: '📱',
    description: 'Cool Blue, Snapdragon 8 Gen 2, 16GB LPDDR5X RAM, 256GB UFS 3.1 storage, 5500mAh Battery with 100W SUPERVOOC charge, 50MP Sony IMX890 camera.',
    stores: [
      { name: 'Amazon', price: 42999, oldPrice: 45999, url: 'https://amazon.in/dp/oneplus-12r' },
      { name: 'Flipkart', price: 42490, oldPrice: 45999, url: 'https://flipkart.com/oneplus-12r' },
      { name: 'Croma', price: 42999, oldPrice: 45999, url: 'https://croma.com/p/oneplus-12r' },
      { name: 'Reliance Digital', price: 42800, oldPrice: 45999, url: 'https://reliancedigital.in/p/oneplus-12r' }
    ],
    priceHistory: [
      { date: '2026-01-01', price: 45999 },
      { date: '2026-02-01', price: 44999 },
      { date: '2026-03-01', price: 44500 },
      { date: '2026-04-01', price: 43999 },
      { date: '2026-05-01', price: 43200 },
      { date: '2026-06-01', price: 42490 }
    ],
    pros: [
      'Incredibly fast 100W charging (charger included)',
      'Beautiful 1.5K LTPO 4.0 AMOLED 120Hz curved display',
      'Massive 5500mAh battery delivers 1.5 - 2 days backup',
      'Smooth performance with Snapdragon 8 Gen 2'
    ],
    cons: [
      'Secondary cameras (8MP ultra-wide, 2MP macro) are mediocre',
      'No wireless charging support',
      'Curved screen is prone to accidental touch and glass damage'
    ],
    aiReview: 'The OnePlus 12R is a gaming and performance champ under ₹45,000. It matches flagship devices in battery life, charging speed, and screen quality. If you want top-tier camera zoom, look elsewhere, but for pure power and value, it is undefeated.',
    featured: false,
    todayDeal: false,
    priceDropToday: true
  },
  // TVs
  {
    id: 'tv-01',
    name: 'Xiaomi Redmi Smart TV X55',
    category: 'electronics',
    subcategory: 'TVs',
    brand: 'Xiaomi',
    rating: 4.3,
    reviewCount: 310,
    image: '📺',
    description: '139 cm (55 inches) 4K Ultra HD Smart LED Fire TV, Dolby Vision, HDR10+, 30W Speakers with Dolby Audio, Dual-band Wi-Fi, Alexa built-in.',
    stores: [
      { name: 'Amazon', price: 31999, oldPrice: 39999, url: 'https://amazon.in/dp/redmi-tv-55', couponCode: 'REDMITV2K' },
      { name: 'Flipkart', price: 32499, oldPrice: 39999, url: 'https://flipkart.com/redmi-tv-55' },
      { name: 'Croma', price: 31999, oldPrice: 39999, url: 'https://croma.com/p/redmi-tv-55' },
      { name: 'Reliance Digital', price: 32100, oldPrice: 39999, url: 'https://reliancedigital.in/p/redmi-tv-55' }
    ],
    priceHistory: [
      { date: '2026-01-01', price: 35000 },
      { date: '2026-02-01', price: 34500 },
      { date: '2026-03-01', price: 34000 },
      { date: '2026-04-01', price: 33000 },
      { date: '2026-05-01', price: 32499 },
      { date: '2026-06-01', price: 31999 }
    ],
    pros: [
      'Very affordable 4K display with Dolby Vision support',
      'Punchy sound with 30W output',
      'Fire TV OS is fluid and has excellent app support',
      'Sleek bezels look modern and premium'
    ],
    cons: [
      'Viewing angles are narrow; colors shift when viewed from side',
      'Processor has minor lag when opening multiple heavy apps',
      'Black levels are average, typical for an budget LED TV'
    ],
    aiReview: 'Redmi Smart TV X55 provides an outstanding budget home theater experience. For under ₹35,000, getting 4K with Dolby Vision and Alexa is rare. Ideal for casual movie watching in moderate lighting, though videophiles might crave an OLED.',
    featured: false,
    todayDeal: true,
    priceDropToday: false
  },
  // Accessories
  {
    id: 'acc-01',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'electronics',
    subcategory: 'Accessories',
    brand: 'Sony',
    rating: 4.7,
    reviewCount: 1120,
    image: '🎧',
    description: 'Active Noise Cancelling Wireless Over-Ear Headphones, 30hr battery, multipoint connection, Alexa built-in, touch controls.',
    stores: [
      { name: 'Amazon', price: 26990, oldPrice: 34990, url: 'https://amazon.in/dp/sony-xm5', couponCode: 'ANCEXTRA1K' },
      { name: 'Flipkart', price: 25990, oldPrice: 34990, url: 'https://flipkart.com/sony-xm5' },
      { name: 'Croma', price: 26990, oldPrice: 34990, url: 'https://croma.com/p/sony-xm5' },
      { name: 'Reliance Digital', price: 27100, oldPrice: 34990, url: 'https://reliancedigital.in/p/sony-xm5' }
    ],
    priceHistory: [
      { date: '2026-01-01', price: 29990 },
      { date: '2026-02-01', price: 28990 },
      { date: '2026-03-01', price: 28500 },
      { date: '2026-04-01', price: 27990 },
      { date: '2026-05-01', price: 26990 },
      { date: '2026-06-01', price: 25990 }
    ],
    pros: [
      'Industry-leading active noise cancellation',
      'Extremely comfortable, light earcups for long flights',
      'Superb microphone quality for zoom calls',
      'Customizable rich EQ through headphones app'
    ],
    cons: [
      'Design does not fold into a compact size (larger travel case)',
      'No official IP rating for water/sweat resistance',
      'The custom headband adjustment slider can feel loose over time'
    ],
    aiReview: 'The Sony WH-1000XM5 provides the best noise cancellation and mic isolation on the market today. It is perfect for remote workers and frequent travelers. If you exercise heavily, get dedicated workout earbuds due to sweat risks.',
    featured: true,
    todayDeal: true,
    priceDropToday: true
  },

  // Fashion - Men
  {
    id: 'fash-01',
    name: "Levi's Men's 511 Slim Fit Jeans",
    category: 'fashion',
    subcategory: 'Men',
    brand: "Levi's",
    rating: 4.4,
    reviewCount: 310,
    image: '👖',
    description: 'Classic Blue Slim Fit stretchable denim jeans. Cotton blend with elastane for flexibility and comfortable daily wear.',
    stores: [
      { name: 'Amazon', price: 1899, oldPrice: 3299, url: 'https://amazon.in/dp/levis-511' },
      { name: 'Flipkart', price: 1799, oldPrice: 3299, url: 'https://flipkart.com/levis-511' }
    ],
    priceHistory: [
      { date: '2026-04-01', price: 2500 },
      { date: '2026-05-01', price: 2200 },
      { date: '2026-06-01', price: 1799 }
    ],
    pros: ['Superb classic fit', 'Stretchy, premium denim', 'Highly durable stitching'],
    cons: ['Slight dye bleeding on first wash', 'Limited waist/length options'],
    featured: false,
    todayDeal: true,
    priceDropToday: true
  },
  // Fashion - Women
  {
    id: 'fash-02',
    name: 'Biba Women Kurta with Dupatta Set',
    category: 'fashion',
    subcategory: 'Women',
    brand: 'Biba',
    rating: 4.5,
    reviewCount: 154,
    image: '👗',
    description: 'Floral printed straight cotton kurta with printed pants and chiffon dupatta. Perfect for ethnic wear and traditional functions.',
    stores: [
      { name: 'Amazon', price: 2499, oldPrice: 4999, url: 'https://amazon.in/dp/biba-kurta' },
      { name: 'Flipkart', price: 2399, oldPrice: 4999, url: 'https://flipkart.com/biba-kurta' }
    ],
    priceHistory: [
      { date: '2026-04-01', price: 3500 },
      { date: '2026-05-01', price: 3000 },
      { date: '2026-06-01', price: 2399 }
    ],
    pros: ['100% breathable pure cotton', 'Elegant traditional design', 'Accurate standard Biba sizing'],
    cons: ['Needs gentle hand wash', 'Chiffon dupatta is delicate and slips easily'],
    featured: true,
    todayDeal: false,
    priceDropToday: false
  },
  // Fashion - Kids
  {
    id: 'fash-03',
    name: 'Unisex Kids Cotton T-Shirt Set (Pack of 3)',
    category: 'fashion',
    subcategory: 'Kids',
    brand: 'U.S. Polo Assn.',
    rating: 4.3,
    reviewCount: 95,
    image: '👕',
    description: 'Pack of three multi-colored crew neck graphic t-shirts. 100% premium soft combed cotton for gentle baby/kids skin.',
    stores: [
      { name: 'Amazon', price: 899, oldPrice: 1599, url: 'https://amazon.in/dp/kids-tshirts' },
      { name: 'Flipkart', price: 849, oldPrice: 1599, url: 'https://flipkart.com/kids-tshirts' }
    ],
    priceHistory: [
      { date: '2026-05-01', price: 1100 },
      { date: '2026-06-01', price: 849 }
    ],
    pros: ['Very soft feel', 'Bright tagless labels to prevent scratching', 'Great color options'],
    cons: ['Slight shrinkage after hot tumble drying'],
    featured: false,
    todayDeal: true,
    priceDropToday: true
  },

  // Grocery
  {
    id: 'groc-01',
    name: 'Happilo Premium California Almonds (500g)',
    category: 'grocery',
    subcategory: 'Pantry',
    brand: 'Happilo',
    rating: 4.5,
    reviewCount: 1245,
    image: '🥜',
    description: 'Raw, fresh California almonds. High in protein, dietary fiber, and healthy monounsaturated fats. Gluten-free and non-GMO.',
    stores: [
      { name: 'Amazon', price: 389, oldPrice: 599, url: 'https://amazon.in/dp/happilo-almonds' },
      { name: 'Flipkart', price: 379, oldPrice: 599, url: 'https://flipkart.com/happilo-almonds' }
    ],
    priceHistory: [
      { date: '2026-05-01', price: 450 },
      { date: '2026-06-01', price: 379 }
    ],
    pros: ['Crisp, fresh quality', 'Secure vacuum-sealed pack', 'No preservatives'],
    cons: ['Almond sizes can vary across batches'],
    featured: true,
    todayDeal: true,
    priceDropToday: true
  },

  // Software - Hosting, VPN, Domains, etc.
  {
    id: 'soft-01',
    name: 'Hostinger Premium Web Hosting (1 Year)',
    category: 'software',
    subcategory: 'Hosting',
    brand: 'Hostinger',
    rating: 4.6,
    reviewCount: 3450,
    image: '🌐',
    description: 'Premium Web Hosting for up to 100 websites, 100GB SSD storage, Free weekly backups, Free unlimited SSL, Free Domain ($9.99 value) and managed WordPress.',
    stores: [
      { name: 'Hostinger Direct', price: 1788, oldPrice: 4788, url: 'https://hostinger.com/thedeals24', couponCode: 'THEDEALS24' }
    ],
    priceHistory: [
      { date: '2026-01-01', price: 2200 },
      { date: '2026-04-01', price: 1900 },
      { date: '2026-06-01', price: 1788 }
    ],
    pros: ['Extremely cheap renewal and starter pricing', 'Intuitive hPanel dashboard with WordPress integration', 'Free global CDN and SSL certs included'],
    cons: ['No telephone support (chat only)', 'Slightly slower response times compared to high-end Cloud VPS'],
    featured: true,
    todayDeal: true,
    priceDropToday: true
  },
  {
    id: 'soft-02',
    name: 'NordVPN 2-Year Plan',
    category: 'software',
    subcategory: 'VPN',
    brand: 'NordVPN',
    rating: 4.7,
    reviewCount: 8940,
    image: '🛡️',
    description: 'Top rated virtual private network subscription. Protects up to 6 devices with high-speed double encryption, malware protection, and tracking block.',
    stores: [
      { name: 'NordVPN Store', price: 3400, oldPrice: 7200, url: 'https://nordvpn.com/thedeals24', couponCode: 'SECURE24' }
    ],
    priceHistory: [
      { date: '2026-05-01', price: 4200 },
      { date: '2026-06-01', price: 3400 }
    ],
    pros: ['Excellent connection speeds', 'Thousands of servers globally', 'Strong zero-logs privacy policy'],
    cons: ['Interface can feel cluttered on smaller mobile screens'],
    featured: false,
    todayDeal: false,
    priceDropToday: false
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'c-01', store: 'Amazon', code: 'AMZSHOP10', discount: '10% OFF', description: 'Get 10% instant discount on fashion and beauty orders above ₹1,999.', expiry: '2026-12-31' },
  { id: 'c-02', store: 'Flipkart', code: 'FLIPBANK500', discount: '₹500 OFF', description: 'Flat ₹500 off on select home electronics using HDFC credit cards.', expiry: '2026-07-15' },
  { id: 'c-03', store: 'Croma', code: 'CROMACOOL3K', discount: '₹3000 OFF', description: 'Save ₹3,000 on ACs and Refrigerators over ₹30,000.', expiry: '2026-08-30' },
  { id: 'c-04', store: 'Hostinger', code: 'DEALS24SPECIAL', discount: '15% EXTRA', description: 'Get an extra 15% discount on all cloud and premium hosting plans.', expiry: '2026-10-31' },
  { id: 'c-05', store: 'NordVPN', code: 'VPNBLOCK80', discount: '80% OFF', description: 'Get up to 80% off on 2-year subscriptions + 3 months free.', expiry: '2026-09-15' }
];

export const INITIAL_TRAVEL_OFFERS: TravelOffer[] = [
  {
    id: 'tr-01',
    type: 'flight',
    title: 'Delhi to Singapore Direct Flights',
    description: 'Fly direct on premium airlines with return tickets starting at a discount. Hand luggage + meals included.',
    price: '₹22,499',
    oldPrice: '₹28,000',
    destination: 'Singapore',
    imageUrl: '✈️'
  },
  {
    id: 'tr-02',
    type: 'hotel',
    title: '5-Star Luxury Resort in Dubai (4 Nights)',
    description: 'Immersive beachfront resort with daily buffet breakfast, desert safari tours, and free Burj Khalifa access.',
    price: '₹34,999',
    oldPrice: '₹45,000',
    destination: 'Dubai',
    imageUrl: '🏨'
  },
  {
    id: 'tr-03',
    type: 'package',
    title: 'Complete Bali Adventure (6 Days/5 Nights)',
    description: 'Includes private villa, private driver, guided Ubud tour, island hopping, airport transfers, and select activities.',
    price: '₹29,999',
    oldPrice: '₹39,999',
    destination: 'Bali',
    imageUrl: '🏝️'
  },
  {
    id: 'tr-04',
    type: 'insurance',
    title: 'Worldwide Comprehensive Travel Insurance',
    description: 'Medical cover up to $100k, flight delay, baggage loss, passport replacement cover, and 24/7 global help desk.',
    price: '₹999',
    oldPrice: '₹1,500',
    destination: 'Global',
    imageUrl: '🛡️✈️'
  }
];

export const INITIAL_CREDIT_CARDS: CreditCardOffer[] = [
  {
    id: 'cc-01',
    bank: 'SBI Card',
    cardName: 'Cashback SBI Card',
    benefits: [
      '5% Cashback on all online transactions without merchant restrictions',
      '1% Cashback on offline retail spending',
      'No cashback capping on online transactions up to ₹5,000/billing cycle',
      '1% Fuel surcharge waiver'
    ],
    annualFee: '₹999 (Reversed on ₹2 Lakh annual spend)',
    offer: 'Get ₹500 welcome voucher upon card activation',
    imageUrl: '💳'
  },
  {
    id: 'cc-02',
    bank: 'HDFC Bank',
    cardName: 'Millennia Credit Card',
    benefits: [
      '5% Cashback on Amazon, Flipkart, Myntra, Swiggy, Uber, BookMyShow',
      '1% Cashback on offline spends and wallet loads',
      '8 Complimentary domestic airport lounge visits per year',
      '1% Fuel surcharge waiver at all stations'
    ],
    annualFee: '₹1,000 (Waived on ₹1 Lakh annual spend)',
    offer: 'Spend ₹1.5 Lakhs in a year and get ₹1,000 gift vouchers',
    imageUrl: '💳'
  },
  {
    id: 'cc-03',
    bank: 'ICICI Bank',
    cardName: 'Amazon Pay ICICI Credit Card',
    benefits: [
      '5% Cashback on Amazon for Prime members (unlimited)',
      '3% Cashback on Amazon for non-Prime members',
      '2% Cashback on 100+ partner merchants (Swiggy, Uber, etc.)',
      'No joining or annual fee - Lifetime Free'
    ],
    annualFee: 'Lifetime Free (₹0)',
    offer: 'Earn up to ₹1,500 welcome reward points upon approval',
    imageUrl: '💳'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-01',
    title: 'How to Save Over ₹15,000 on Laptop Purchases This Year',
    excerpt: 'Laptops are a major investment. Learn how to track price patterns, apply stackable bank cards, and double-dip on affiliate coupons.',
    content: `Laptops are one of the most high-value purchases we make. With prices varying day-to-day by up to 15%, timing is everything. Here is the step-by-step master plan to maximize your savings:

1. **Understand the Price Cycles**: Major retailers like Amazon and Flipkart have cyclical price adjustments. Electronics typically hit their lowest prices in October (during the Great Indian Festival / Big Billion Days) and again around July.
2. **Utilize Price History Graphs**: Never assume a "Sale" tag means the price is low. Check price trackers to see what the laptop sold for 3 months ago. Often, manufacturers artificially inflate the 'MSRP' right before a major discount.
3. **Double-Dip with Coupon Codes**: Major credit cards offer standard flat discounts (like 10% instant off). Pair these with retailer coupons or specific affiliate voucher codes (like 'SAVE1000' on Dell's portal) to save double.
4. **Negotiate with Offline Stores**: If buying from Croma or Reliance Digital, open our price comparison page. Show them the lower online price, and they will almost always match it or bundle expensive bags/accessories for free.`,
    date: '2026-06-25',
    author: 'Amit Kumar',
    imageUrl: '📝💻'
  },
  {
    id: 'blog-02',
    title: 'The Truth About Credit Card Cashback Cappings Explained',
    excerpt: 'Cashback cards are highly lucrative, but complex terms can void your rewards. We break down the SBI and HDFC fine print.',
    content: `Credit cards promise 5% cashback on online purchases, which sounds amazing. But hidden under the asterisk are 'capping caps'. If you buy a mobile worth ₹60,000, you will NOT get a full 5% back on some cards. Let us break down the leading cashback cards:

- **SBI Cashback Card**: Provides 5% cashback on all online merchants. However, there is a maximum monthly capping of ₹5,000 cashback per billing cycle. This means any purchases above ₹1,00,000 per month will earn a flat 1% instead.
- **HDFC Millennia**: Offers 5% cashback on partner websites like Amazon and Swiggy. The capping is ₹1,000 per month. Hence, it is best for monthly online shopping budgets up to ₹20,000.
- **Amazon Pay ICICI Card**: This is a lifetime free card with **no capping whatsoever** on 5% cashback. The caveat is that the 5% only applies to purchases made *on Amazon* for Prime members.

**Conclusion**: If you are a high-volume shopper across various sites, use the SBI Cashback Card. For dedicated Amazon buying, the ICICI card is the undisputed king.`,
    date: '2026-06-20',
    author: 'Neha Sharma',
    imageUrl: '💳📉'
  }
];

export const INITIAL_BUYING_GUIDES: BuyingGuide[] = [
  {
    id: 'guide-01',
    title: 'Best Gaming Laptops under ₹60,000 in India (2026)',
    excerpt: 'Detailed analysis of high-refresh screens, thermal throttling, and GPU choices for budget gamers.',
    content: `Finding a solid gaming laptop under ₹60,000 can be tough because manufacturers often cut corners on build quality, cooling, or screen color accuracy. Here is what to look for:

1. **The Graphics Processing Unit (GPU)**:
   - Avoid laptops with GTX 1650 or RTX 2050 if possible, as they are severely outdated.
   - Look for the **RTX 3050** or the newer **RTX 4050** (which supports DLSS 3.0 Frame Generation). RTX 3050 laptops are regularly discounted below ₹58,000.

2. **The Processor (CPU)**:
   - AMD Ryzen 5 (5600H or 7535HS) provides excellent power efficiency and battery.
   - Intel Core i5 (12450H or 13420H) delivers better single-core performance for esports.

3. **RAM and Storage**:
   - Strictly avoid 8GB RAM models unless you plan to upgrade them immediately. Windows 11 and heavy games will easily crash or stutter with 8GB. A minimum of 16GB dual-channel is mandatory.

4. **Thermals**:
   - Budget laptops like HP Victus and Acer Nitro have excellent dual-fan cooling chambers, whereas ultra-thin laptops will throttle within 15 minutes of gaming.`,
    category: 'Electronics',
    tags: ['Laptops', 'Gaming', 'Budget', 'Buying Guide']
  },
  {
    id: 'guide-02',
    title: 'How to Choose the Best Smart TV for Cozy Living Rooms',
    excerpt: 'LED vs QLED vs OLED, ideal screen sizing guides, and Fire OS vs Google TV platforms compared.',
    content: `Before buying a TV, do not just fall for the "Ultra HD" label. Consider these factors:

1. **Size vs Viewing Distance**:
   - For a standard living room where you sit 6 to 8 feet away, a **55-inch TV** is the absolute sweet spot.
   - If you sit under 5 feet, a 43-inch TV will be more comfortable and prevent eye strain.

2. **Display Panel Types**:
   - **LED**: Affordable and bright. Perfect for brightly lit living rooms.
   - **QLED**: Uses quantum dots for vastly richer colors and high brightness. Excellent mid-range choice.
   - **OLED**: Self-lit pixels offer absolute blacks and infinite contrast. Best for dark, movie-theater style rooms, but very expensive.

3. **Software OS**:
   - **Google TV**: Offers the best recommendation algorithms and works flawlessly with Chromecast.
   - **Fire TV**: Great Alexa integration and ideal if you have an Echo smart home system.`,
    category: 'Electronics',
    tags: ['TVs', 'Home Theater', 'Smart TV']
  }
];

export const INITIAL_AFFILIATE_DEALS: any[] = [
  {
    id: "aff-16942202",
    advertiser: "FragranceShop.com",
    targetedCountries: "",
    linkId: "16942202",
    name: "Designer Fragrance - Discount Prices",
    description: "Explore our wide selection of designer fragrances and colognes at discounted prices",
    keywords: "FragranceShop, perfume, cologne, brand name fragrance",
    linkType: "Text Link",
    threeMonthEpc: "$24.75 USD",
    sevenDayEpc: "$46.00 USD",
    lastUpdated: "22-Oct-2024",
    htmlLinks: "<a href=\"https://www.tkqlhce.com/click-101808174-16942202\" target=\"_top\">Explore our wide selection of designer fragrances and colognes at discounted prices</a><img src=\"https://www.tqlkg.com/image-101808174-16942202\" width=\"1\" height=\"1\" border=\"0\"/>",
    javascriptLinks: "",
    clickUrl: "https://www.dpbolvw.net/click-101808174-16942202",
    promotionType: "N/A",
    couponCode: "",
    promotionalDate: "",
    promotionalEndDate: "",
    category: "Fragrance",
    advCid: "7287203",
    relationshipStatus: "Active",
    language: "English",
    mobileOptimized: "Yes"
  },
  {
    id: "aff-17048225",
    advertiser: "Onebioshop.com",
    targetedCountries: "",
    linkId: "17048225",
    name: "Superpromo - Beauty & Filler Scontati fino all'80%",
    description: "I Top Brand di salute e Bellezza scontati fino all'80%",
    keywords: "onebioshop, health, beauty, filler, cosmetics, hair product",
    linkType: "Text Link",
    threeMonthEpc: "N/A",
    sevenDayEpc: "N/A",
    lastUpdated: "13-Mar-2025",
    htmlLinks: "",
    javascriptLinks: "",
    clickUrl: "https://www.dpbolvw.net/click-101808174-17048225",
    promotionType: "N/A",
    couponCode: "",
    promotionalDate: "",
    promotionalEndDate: "",
    category: "Cosmetics",
    advCid: "7301807",
    relationshipStatus: "Active",
    language: "Italian",
    mobileOptimized: "Yes"
  },
  {
    id: "aff-17277211",
    advertiser: "Perfumania.com",
    targetedCountries: "US",
    linkId: "17277211",
    name: "Travel Size Atomizers 2 for $25",
    description: "Travel Size Atomizers - Online & In-Store Travel in Style and Convenience with Flo",
    keywords: "travel atomizers, travel, atomizers, perfumes travel",
    linkType: "Text Link",
    threeMonthEpc: "N/A",
    sevenDayEpc: "N/A",
    lastUpdated: "15-Apr-2026",
    htmlLinks: "",
    javascriptLinks: "",
    clickUrl: "https://www.jdoqocy.com/click-101808174-17277211",
    promotionType: "N/A",
    couponCode: "",
    promotionalDate: "",
    promotionalEndDate: "",
    category: "Fragrance",
    advCid: "904674",
    relationshipStatus: "Active",
    language: "English",
    mobileOptimized: "Yes"
  },
  {
    id: "aff-17210287",
    advertiser: "RSE",
    targetedCountries: "",
    linkId: "17210287",
    name: "BGMgirl homepage Link UP TO 66% OFF - Always valid",
    description: "Bgmgirl homepage Link 66% OFF - Always valid",
    keywords: "wig, cosmetics, bgmgirl, hair product",
    linkType: "Text Link",
    threeMonthEpc: "$13.69 USD",
    sevenDayEpc: "N/A",
    lastUpdated: "16-Apr-2026",
    htmlLinks: "",
    javascriptLinks: "",
    clickUrl: "https://www.kqzyfj.com/click-101808174-17210287",
    promotionType: "N/A",
    couponCode: "",
    promotionalDate: "",
    promotionalEndDate: "",
    category: "Cosmetics",
    advCid: "7721121",
    relationshipStatus: "Active",
    language: "English",
    mobileOptimized: "Yes"
  }
];

