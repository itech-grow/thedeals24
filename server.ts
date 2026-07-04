import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully.');
  } else {
    console.warn('Warning: GEMINI_API_KEY is not set. AI features will fallback to client-side rule-based replies.');
  }
} catch (err) {
  console.error('Error initializing Gemini Client:', err);
}

// 1. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. API: AI Shopping Assistant Chat
app.post('/api/chat', async (req, res) => {
  const { messages, contextProducts } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  // Construct context
  const productContextStr = contextProducts && Array.isArray(contextProducts) 
    ? contextProducts.map((p: any) => 
        `- ${p.name} (${p.brand}): Category: ${p.category} -> ${p.subcategory}. Rating: ${p.rating}⭐. Stores: ${p.stores.map((s: any) => `${s.name}: ₹${s.price}`).join(', ')}.`
      ).join('\n')
    : '';

  const systemInstruction = `You are "TheDeals24" - Your Smart Shopping Assistant.
Your goal is to help users find the best deals, compare prices, understand pros/cons of products, get coupons, track price drops, and discover travel and credit card offers.
You are objective, trustworthy, and expert in smart shopping.

Here is a catalog of some trending products currently available on TheDeals24 website for you to recommend if relevant:
${productContextStr}

Rules:
1. Always recommend 3-5 options when users ask for product recommendations (e.g. "Best laptop under ₹60,000" or "best smartphone").
2. For each recommendation, provide:
   - Approximate price
   - Key positive highlight (Pro)
   - One drawback (Con)
   - Store choices (e.g. Amazon, Flipkart, Croma)
3. Do not invent completely fake prices. Use Indian Rupee (₹) as the primary currency since the store comparison has Amazon India, Flipkart, etc.
4. Keep the tone friendly, informative, structured, and helpful. Use markdown list formatting and bold text for clarity. Do not use markdown headers higher than h3.`;

  try {
    if (!ai) {
      throw new Error('Gemini API is not initialized. Please verify your GEMINI_API_KEY inside Settings > Secrets.');
    }

    // Map conversation history
    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Generate content using gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: conversationHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || 'Sorry, I am unable to process your request at the moment.' });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    // Provide a neat fallback message indicating the error gracefully
    res.status(500).json({ 
      error: error.message || 'Gemini server error',
      reply: `I encountered an issue connecting to my AI brain. Please check that your **GEMINI_API_KEY** is configured in **Settings > Secrets**.

*Fallback Tip:* For laptops, the **Dell Inspiron 15 (₹51,990)** is an amazing budget choice with a 120Hz display, and the **MacBook Air M2 (₹88,490)** is undefeated for absolute battery performance!`
    });
  }
});

// 3. API: AI Product Summarizer (Pros & Cons Review)
app.post('/api/summarize', async (req, res) => {
  const { productName, description, pros, cons } = req.body;

  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  try {
    if (!ai) {
      throw new Error('Gemini API is not initialized. Please verify your GEMINI_API_KEY.');
    }

    const prompt = `Provide a comprehensive smart expert summary and AI Review for the product: "${productName}".
    
Description details:
${description || 'No description provided.'}

User-submitted Pros:
${pros ? pros.join('\n') : 'None'}

User-submitted Cons:
${cons ? cons.join('\n') : 'None'}

Generate a beautiful, concise 3-paragraph executive review.
Paragraph 1: Ideal target buyer and overall expert verdict.
Paragraph 2: Detailed breakdown of what makes it a stellar buy (highlighting its strengths).
Paragraph 3: Fair warning on drawbacks or what to keep in mind before checking out, and how it compares to alternative options in the market.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    res.json({ summary: response.text || 'Unable to generate review summary.' });
  } catch (error: any) {
    console.error('Gemini Summarize API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Gemini server error',
      summary: `*Note: AI Summary requires a configured GEMINI_API_KEY in Secrets.*

**Verdict:** The **${productName}** is highly rated by experts. It offers great value for consumers seeking reliable day-to-day performance in its category.

**Why buy:** It has very competitive pricing compared to direct rivals, strong manufacturer warranty support, and top-rated user satisfaction for its build quality.

**Drawback:** Consider your exact usage. For entry-level users, this is an perfect match, but power-users might want to compare higher-spec options before buying.`
    });
  }
});

// 4. API: Live Web Search Product (Amazon & Flipkart Grounded Search)
app.post('/api/search-web-product', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const normalizedQuery = query.toLowerCase().trim();

  // High-quality static fallbacks for an amazing, robust, zero-configuration local experience
  const fallbacks: { [key: string]: any } = {
    'iphone': {
      name: 'Apple iPhone 16 (128 GB) - Black',
      brand: 'Apple',
      category: 'electronics',
      subcategory: 'Mobiles',
      rating: 4.7,
      reviewCount: 3410,
      image: '📱',
      stores: [
        { name: 'Amazon', price: 79900, oldPrice: 79900, url: 'https://www.amazon.in/dp/B0DGHPG8D6' },
        { name: 'Flipkart', price: 78900, oldPrice: 79900, url: 'https://www.flipkart.com/apple-iphone-16-black-128-gb' }
      ],
      pros: ['Incredibly bright Super Retina XDR screen with Action button', 'Camera Control button for immediate photo/video adjustment', 'Superb battery life and A18 processor for heavy gaming'],
      cons: ['Still restricted to 60Hz display refresh rate on standard model', 'Charging speed is slightly slower compared to Android competitors', 'Base variant starts with only 128GB of non-expandable storage'],
      description: 'The Apple iPhone 16 features an advanced dual-camera system with a 48MP Fusion camera, the powerful A18 processor with 5-core GPU, and the revolutionary Camera Control button for ultimate creative control.'
    },
    'samsung': {
      name: 'Samsung Galaxy S24 5G (256 GB) - Amber Yellow',
      brand: 'Samsung',
      category: 'electronics',
      subcategory: 'Mobiles',
      rating: 4.6,
      reviewCount: 1850,
      image: '📱',
      stores: [
        { name: 'Amazon', price: 74999, oldPrice: 79999, url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 73999, oldPrice: 79999, url: 'https://www.flipkart.com' }
      ],
      pros: ['Stunning 120Hz LTPO Dynamic AMOLED display with ultra-slim bezels', 'Packed with futuristic Galaxy AI features like Circle to Search', 'Seven years of guaranteed OS and security upgrades'],
      cons: ['Exynos 2400 processor in select regions instead of Snapdragon', 'Slow 25W charging compared to crazy speeds from OnePlus/Xiaomi', 'Marginal camera hardware updates compared to previous generation'],
      description: 'The Galaxy S24 delivers next-generation AI features, an extremely bright and vibrant display, a versatile triple-camera system, and premium, robust armor aluminum build.'
    },
    'macbook': {
      name: 'Apple MacBook Air M3 Laptop (8GB Unified Memory, 256GB SSD) - Space Grey',
      brand: 'Apple',
      category: 'electronics',
      subcategory: 'Laptops',
      rating: 4.8,
      reviewCount: 1250,
      image: '💻',
      stores: [
        { name: 'Amazon', price: 104900, oldPrice: 114900, url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 102900, oldPrice: 114900, url: 'https://www.flipkart.com' }
      ],
      pros: ['Blazing-fast M3 chip handles standard tasks and editing with ease', 'Super slim, light, fanless design is entirely noiseless', 'Incredible battery life lasting up to 18 hours of continuous use'],
      cons: ['Base model still ships with only 8GB of non-upgradable RAM', 'Can only connect up to two external displays with laptop lid closed', 'Standard 256GB storage filled up very quickly by high-res media'],
      description: 'The supercharged Apple MacBook Air M3 offers incredible performance, a vibrant 13.6-inch Liquid Retina display, a 1080p FaceTime HD camera, and a stellar fanless silent design.'
    },
    'sony': {
      name: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones - Black',
      brand: 'Sony',
      category: 'electronics',
      subcategory: 'Headphones',
      rating: 4.7,
      reviewCount: 4520,
      image: '🎧',
      stores: [
        { name: 'Amazon', price: 29990, oldPrice: 34990, url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 28990, oldPrice: 34990, url: 'https://www.flipkart.com' }
      ],
      pros: ['Industry-leading Active Noise Cancellation (ANC) performance', 'Extremely comfortable and feather-light redesigned earcups', 'Exceptional 30-hour battery life with ultra-fast charging support'],
      cons: ['Headphones do not fold down fully into a compact form factor', 'The touch-sensitive gesture controls can occasionally trigger by mistake', 'Lacks water resistance rating, making it risky for intense workouts'],
      description: 'Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening with two processors controlling eight microphones, Auto NC Optimizer, and an ultra-comfortable lightweight design.'
    },
    'pixel': {
      name: 'Google Pixel 9 Pro 5G (16GB RAM, 256GB) - Obsidian',
      brand: 'Google',
      category: 'electronics',
      subcategory: 'Mobiles',
      rating: 4.6,
      reviewCount: 680,
      image: '📱',
      stores: [
        { name: 'Amazon', price: 109999, oldPrice: 109999, url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 108999, oldPrice: 109999, url: 'https://www.flipkart.com' }
      ],
      pros: ['Incredible 16GB RAM is highly optimized for complex Gemini Pro AI', 'Pro triple camera system with unmatched photo processing detail', 'Stunning, high-brightness Actua display with premium satin finish'],
      cons: ['Google Tensor G4 chip is not optimized for high-end graphic gaming', 'Relatively slow charging speed compared to top Chinese flagships', 'The sleek camera bar adds noticeable weight to the top of the phone'],
      description: 'The Google Pixel 9 Pro is Google\'s most powerful phone yet, featuring the advanced Tensor G4 chip, 16GB RAM for native Gemini AI capabilities, and a pro-level camera system.'
    }
  };

  try {
    if (!ai) {
      throw new Error('Gemini API is not initialized. Please configure your GEMINI_API_KEY inside Settings > Secrets.');
    }

    const systemInstruction = `You are an expert product-pricing research agent.
Your task is to use Google Search Grounding to find real, current, live details for the product search query requested by the user.
Specifically, search for the product on major Indian shopping sites, particularly Amazon.in and Flipkart.com.
Find the actual current prices in Indian Rupees (₹), original MRP (oldPrice), average rating, and user reviews.
Extract 3 distinct Pros, 3 distinct Cons, a brief description, brand, category, and subcategory.
Format the output as a clean, single JSON object adhering precisely to the provided responseSchema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Search Flipkart and Amazon to find current details and live pricing for: "${query}". Ensure prices are in Indian Rupees (₹).`,
      config: {
        systemInstruction,
        temperature: 0.2,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            subcategory: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            reviewCount: { type: Type.INTEGER },
            image: { type: Type.STRING },
            stores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.INTEGER },
                  oldPrice: { type: Type.INTEGER },
                  url: { type: Type.STRING }
                },
                required: ["name", "price", "oldPrice", "url"]
              }
            },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            description: { type: Type.STRING }
          },
          required: ["name", "brand", "category", "subcategory", "rating", "reviewCount", "image", "stores", "pros", "cons", "description"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    
    // Add generated dynamic ID
    const productWithId = {
      id: `web-search-${Date.now()}`,
      ...parsedData,
      featured: false,
      todayDeal: true,
      priceDropToday: false,
      priceHistory: [
        { date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0], price: Math.round((parsedData.stores?.[0]?.price || 10000) * 1.05) },
        { date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString().split('T')[0], price: Math.round((parsedData.stores?.[0]?.price || 10000) * 1.02) },
        { date: new Date().toISOString().split('T')[0], price: parsedData.stores?.[0]?.price || 10000 }
      ]
    };

    res.json({ success: true, product: productWithId });

  } catch (error: any) {
    console.warn('Gemini Search Grounding Failed or API Key Missing. Using fallback...', error.message);

    // Try to find a matching fallback item based on keywords
    let matchedKey = Object.keys(fallbacks).find(k => normalizedQuery.includes(k));
    let selectedFallback = matchedKey ? fallbacks[matchedKey] : null;

    if (!selectedFallback) {
      // Create a smart mock/fallback dynamic product based on query
      const estimatedPrice = normalizedQuery.includes('laptop') ? 65000 : normalizedQuery.includes('tv') ? 45000 : 15000;
      selectedFallback = {
        name: query.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        brand: query.split(' ')[0]?.toUpperCase() || 'Generic',
        category: normalizedQuery.includes('laptop') || normalizedQuery.includes('phone') || normalizedQuery.includes('tv') || normalizedQuery.includes('audio') ? 'electronics' : 'others',
        subcategory: normalizedQuery.includes('laptop') ? 'Laptops' : normalizedQuery.includes('phone') ? 'Mobiles' : 'Gadgets',
        rating: 4.5,
        reviewCount: 320,
        image: normalizedQuery.includes('laptop') ? '💻' : normalizedQuery.includes('phone') ? '📱' : normalizedQuery.includes('watch') ? '⌚' : '📦',
        stores: [
          { name: 'Amazon', price: estimatedPrice, oldPrice: Math.round(estimatedPrice * 1.15), url: 'https://www.amazon.in' },
          { name: 'Flipkart', price: Math.round(estimatedPrice * 0.98), oldPrice: Math.round(estimatedPrice * 1.15), url: 'https://www.flipkart.com' }
        ],
        pros: ['Great price-to-performance ratio in its category', 'Solid build quality with standard modern design aesthetics', 'Easy returns and trusted customer service guarantees'],
        cons: ['Lacks high-end premium features of flagship equivalents', 'Software updates can be slow and less frequent', 'Lacks water/dust protection certifications'],
        description: `The ${query} offers standard entry-level to mid-range features designed for everyday utility. Reliable performance, simple setup, and excellent budget accessibility.`
      };
    }

    const finalFallback = {
      id: `web-fallback-${Date.now()}`,
      ...selectedFallback,
      featured: false,
      todayDeal: true,
      priceDropToday: false,
      priceHistory: [
        { date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0], price: Math.round(selectedFallback.stores[0].price * 1.05) },
        { date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString().split('T')[0], price: Math.round(selectedFallback.stores[0].price * 1.02) },
        { date: new Date().toISOString().split('T')[0], price: selectedFallback.stores[0].price }
      ]
    };

    res.json({ success: true, product: finalFallback, isFallback: true });
  }
});

// Serve frontend assets
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
