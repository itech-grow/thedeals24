import React, { useState } from 'react';
import { Product, Coupon, AlertSubscription, TravelOffer, AffiliateDeal } from '../types';
import { 
  PlusCircle, Trash2, Edit, Save, Plus, Tag, Bell, TrendingUp, BarChart2, CheckCircle2, DollarSign,
  FileSpreadsheet, UploadCloud, Download, AlertTriangle, FileCheck, X, RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ProductImage from './ProductImage';

interface AdminPanelViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  affiliateDeals: AffiliateDeal[];
  onAddAffiliateDeal: (deal: AffiliateDeal) => void;
  onDeleteAffiliateDeal: (dealId: string) => void;
  alerts: AlertSubscription[];
  onSetTab: (tab: string) => void;
}

export default function AdminPanelView({
  products,
  onAddProduct,
  onDeleteProduct,
  coupons,
  onAddCoupon,
  affiliateDeals,
  onAddAffiliateDeal,
  onDeleteAffiliateDeal,
  alerts,
  onSetTab
}: AdminPanelViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'coupons' | 'affiliate_deals' | 'analytics'>('products');

  // Excel Import States
  const [uploadMode, setUploadMode] = useState<'manual' | 'excel'>('manual');
  const [parsedProducts, setParsedProducts] = useState<Product[]>([]);
  const [parsedAffDeals, setParsedAffDeals] = useState<AffiliateDeal[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);


  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'electronics' | 'fashion' | 'grocery' | 'software' | 'travel' | 'others'>('electronics');
  const [newProdSubcategory, setNewProdSubcategory] = useState('Laptops');
  const [newProdRating, setNewProdRating] = useState('4.5');
  const [newProdImg, setNewProdImg] = useState('💻');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdAmazon, setNewProdAmazon] = useState('');
  const [newProdFlipkart, setNewProdFlipkart] = useState('');
  const [newProdPros, setNewProdPros] = useState('Superb build quality;Excellent pricing');
  const [newProdCons, setNewProdCons] = useState('Webcam is only average;Plastic construction');
  const [productSuccess, setProductSuccess] = useState(false);

  // New Coupon Form State
  const [newCoupStore, setNewCoupStore] = useState('Amazon');
  const [newCoupCode, setNewCoupCode] = useState('');
  const [newCoupDiscount, setNewCoupDiscount] = useState('10% OFF');
  const [newCoupDesc, setNewCoupDesc] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // New Affiliate Deal Form State
  const [newAffAdvertiser, setNewAffAdvertiser] = useState('');
  const [newAffName, setNewAffName] = useState('');
  const [newAffDescription, setNewAffDescription] = useState('');
  const [newAffClickUrl, setNewAffClickUrl] = useState('');
  const [newAffCouponCode, setNewAffCouponCode] = useState('');
  const [newAffCategory, setNewAffCategory] = useState('Fragrance');
  const [newAffLinkId, setNewAffLinkId] = useState('');
  const [newAffTargetedCountries, setNewAffTargetedCountries] = useState('');
  const [newAffThreeMonthEpc, setNewAffThreeMonthEpc] = useState('');
  const [newAffSevenDayEpc, setNewAffSevenDayEpc] = useState('');
  const [affDealSuccess, setAffDealSuccess] = useState(false);


  // Download excel spreadsheet template dynamically
  const handleDownloadTemplate = () => {
    const headers = [
      {
        "Name": "Sample Premium Laptop Pro",
        "Brand": "Zenith",
        "Category": "electronics",
        "Subcategory": "Laptops",
        "Amazon Price": 65000,
        "Flipkart Price": 64500,
        "Croma Price": 66000,
        "Rating": 4.8,
        "Emoji Icon": "💻",
        "Description": "An incredible powerhouse laptop designed for developers and creators.",
        "Pros": "Super fast performance; Vivid OLED screen; Quiet cooling system",
        "Cons": "Slightly premium price; Limited port selection"
      },
      {
        "Name": "Ultra-light Running Shoes",
        "Brand": "Aero",
        "Category": "fashion",
        "Subcategory": "Shoes",
        "Amazon Price": 3499,
        "Flipkart Price": 3299,
        "Croma Price": "",
        "Rating": 4.4,
        "Emoji Icon": "👟",
        "Description": "Maximum cushioning with breathable knit upper, built for daily training.",
        "Pros": "Extremely light; Great arch support; Budget friendly",
        "Cons": "Not fully waterproof; Limited colors"
      },
      {
        "Name": "Premium Organic Green Tea",
        "Brand": "OrganicLeaf",
        "Category": "grocery",
        "Subcategory": "Beverages",
        "Amazon Price": 399,
        "Flipkart Price": 375,
        "Croma Price": "",
        "Rating": 4.6,
        "Emoji Icon": "🍵",
        "Description": "Pure whole-leaf green tea sourced directly from organic tea gardens.",
        "Pros": "Rich antioxidant content; Fragrant aroma; No additives",
        "Cons": "Slightly bitter if oversteeped"
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Catalog Template");
    XLSX.writeFile(workbook, "deals24_products_upload_template.xlsx");
  };

  // Parsing CSV / Excel logic
  const parseFile = (file: File) => {
    setImportError(null);
    setImportSuccessCount(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json<any>(worksheet);

        if (rawRows.length === 0) {
          setImportError("The uploaded spreadsheet contains no rows.");
          return;
        }

        if (activeSubTab === 'affiliate_deals') {
          const newParsedDeals: AffiliateDeal[] = [];
          const skippedDeals: string[] = [];

          rawRows.forEach((row: any, index: number) => {
            const getValue = (keys: string[]) => {
              for (const key of keys) {
                if (row[key] !== undefined) return row[key];
                const foundKey = Object.keys(row).find(
                  k => k.toLowerCase().replace(/[\s_-]/g, '') === key.toLowerCase().replace(/[\s_-]/g, '')
                );
                if (foundKey && row[foundKey] !== undefined) return row[foundKey];
              }
              return undefined;
            };

            const advertiser = getValue(["ADVERTISER", "Advertiser", "Brand", "Store"]);
            const name = getValue(["NAME", "Name", "Title"]);
            const clickUrl = getValue(["CLICK URL", "Click URL", "ClickUrl", "Link"]);

            if (!advertiser || !name) {
              skippedDeals.push(`Row ${index + 2} (missing Advertiser or Name)`);
              return;
            }

            // Extract clickUrl from HTML Link if clickUrl is empty
            let finalClickUrl = clickUrl ? String(clickUrl).trim() : '';
            if (!finalClickUrl) {
              const htmlLink = getValue(["HTML LINKS", "Html Links", "HtmlLink", "HTML LINK", "Html Link"]);
              if (htmlLink) {
                const match = String(htmlLink).match(/href="([^"]+)"/);
                if (match && match[1]) {
                  finalClickUrl = match[1];
                }
              }
            }

            if (!finalClickUrl) {
              finalClickUrl = "https://www.tkqlhce.com/click-placeholder";
            }

            const description = getValue(["DESCRIPTION", "Description", "Desc"]) || "";
            const category = getValue(["CATEGORY", "Category", "Promo Category"]) || "Fragrance";
            const couponCode = getValue(["COUPON CODE", "Coupon Code", "Code"]) || "";
            const linkId = getValue(["LINK ID", "LinkId", "ID"]) || `aff-${Date.now()}-${index}`;
            const targetedCountries = getValue(["TARGETED COUNTRIES", "Targeted Countries"]) || "";
            const threeMonthEpc = getValue(["THREE MONTH EPC", "Three Month EPC", "EPC"]) || "N/A";
            const sevenDayEpc = getValue(["SEVEN DAY EPC", "Seven Day EPC"]) || "N/A";
            const lastUpdated = getValue(["LAST UDPATED", "Last Updated", "Date", "LAST UPDATED"]) || "";
            const keywords = getValue(["KEYWORDS", "Keywords"]) || "";
            const linkType = getValue(["LINK TYPE", "Link Type"]) || "Text Link";

            const dealItem: AffiliateDeal = {
              id: `aff-excel-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
              advertiser: String(advertiser).trim(),
              name: String(name).trim(),
              description: String(description).trim(),
              clickUrl: String(finalClickUrl).trim(),
              couponCode: String(couponCode).trim(),
              category: String(category).trim(),
              linkId: String(linkId).trim(),
              targetedCountries: String(targetedCountries).trim(),
              threeMonthEpc: String(threeMonthEpc).trim(),
              sevenDayEpc: String(sevenDayEpc).trim(),
              lastUpdated: String(lastUpdated).trim(),
              keywords: String(keywords).trim(),
              linkType: String(linkType).trim()
            };

            newParsedDeals.push(dealItem);
          });

          if (newParsedDeals.length === 0) {
            setImportError("Could not parse any valid affiliate deals. Please make sure sheet has Advertiser and Name headers.");
          } else {
            setParsedAffDeals(newParsedDeals);
            if (skippedDeals.length > 0) {
              setImportError(`Parsed ${newParsedDeals.length} affiliate deals. Skipped ${skippedDeals.length} rows missing Advertiser or Name: ${skippedDeals.slice(0, 2).join(', ')}`);
            }
          }
          return;
        }

        const newParsed: Product[] = [];
        const skippedRows: string[] = [];


        rawRows.forEach((row: any, index: number) => {
          const getValue = (keys: string[]) => {
            for (const key of keys) {
              if (row[key] !== undefined) return row[key];
              const foundKey = Object.keys(row).find(
                k => k.toLowerCase().replace(/[\s_-]/g, '') === key.toLowerCase().replace(/[\s_-]/g, '')
              );
              if (foundKey && row[foundKey] !== undefined) return row[foundKey];
            }
            return undefined;
          };

          const name = getValue(["Name", "Product Name", "title"]);
          const brand = getValue(["Brand", "company"]);
          
          if (!name || !brand) {
            skippedRows.push(`Row ${index + 2} (missing Name or Brand)`);
            return;
          }

          let categoryRaw = String(getValue(["Category"]) || "electronics").toLowerCase().trim();
          let category: 'electronics' | 'fashion' | 'travel' | 'grocery' | 'software' | 'others' = 'electronics';
          if (['electronics', 'fashion', 'travel', 'grocery', 'software', 'others'].includes(categoryRaw)) {
            category = categoryRaw as any;
          }

          const subcategory = String(getValue(["Subcategory", "Sub-category"]) || "Others").trim();
          const rating = Number(getValue(["Rating"]) || 4.5);
          
          const getCategoryEmoji = (cat: string) => {
            switch(cat) {
              case 'electronics': return '💻';
              case 'fashion': return '👟';
              case 'travel': return '✈️';
              case 'grocery': return '🍎';
              case 'software': return '💾';
              default: return '📦';
            }
          };
          const image = String(getValue(["Emoji Icon", "emoji", "image", "Icon"]) || getCategoryEmoji(category)).trim();
          const description = String(getValue(["Description", "desc"]) || `${name} by ${brand} is a featured deal of the day.`).trim();

          const amazonPriceVal = getValue(["Amazon Price", "Amazon", "price"]);
          const flipkartPriceVal = getValue(["Flipkart Price", "Flipkart"]);
          const cromaPriceVal = getValue(["Croma Price", "Croma"]);

          const stores: any[] = [];
          if (amazonPriceVal !== undefined && amazonPriceVal !== "") {
            const price = Number(amazonPriceVal);
            stores.push({ name: 'Amazon', price, oldPrice: Math.round(price * 1.2), url: 'https://amazon.in' });
          }
          if (flipkartPriceVal !== undefined && flipkartPriceVal !== "") {
            const price = Number(flipkartPriceVal);
            stores.push({ name: 'Flipkart', price, oldPrice: Math.round(price * 1.18), url: 'https://flipkart.com' });
          }
          if (cromaPriceVal !== undefined && cromaPriceVal !== "") {
            const price = Number(cromaPriceVal);
            stores.push({ name: 'Croma', price, oldPrice: Math.round(price * 1.15), url: 'https://croma.com' });
          }

          if (stores.length === 0) {
            const fallbackPrice = Number(getValue(["Price"]) || 999);
            stores.push({ name: 'Amazon', price: fallbackPrice, oldPrice: Math.round(fallbackPrice * 1.2), url: 'https://amazon.in' });
          }

          const prosRaw = getValue(["Pros"]);
          const pros = prosRaw ? String(prosRaw).split(';').map(p => p.trim()).filter(Boolean) : ["Superb build quality", "Excellent value"];
          const consRaw = getValue(["Cons"]);
          const cons = consRaw ? String(consRaw).split(';').map(c => c.trim()).filter(Boolean) : ["Limited retail stock"];

          const productItem: Product = {
            id: `lap-excel-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
            name: String(name),
            brand: String(brand),
            category,
            subcategory,
            rating,
            reviewCount: Math.floor(Math.random() * 150) + 20,
            image,
            description,
            stores,
            priceHistory: [
              { date: '2026-05-01', price: Math.round(stores[0].price * 1.1) },
              { date: '2026-06-01', price: stores[0].price }
            ],
            pros,
            cons,
            featured: true,
            todayDeal: true,
            priceDropToday: true
          };

          newParsed.push(productItem);
        });

        if (newParsed.length === 0) {
          setImportError(`Could not parse any valid products. Please make sure sheet has Name and Brand headers.`);
        } else {
          setParsedProducts(newParsed);
          if (skippedRows.length > 0) {
            setImportError(`Parsed ${newParsed.length} products. Skipped ${skippedRows.length} row(s) missing Name/Brand: ${skippedRows.slice(0, 2).join(', ')}`);
          }
        }
      } catch (err: any) {
        console.error(err);
        setImportError(`Error parsing sheet: ${err.message || 'Check format'}`);
      }
    };
    reader.onerror = () => {
      setImportError("Failed to read the selected file.");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleCommitImport = () => {
    if (activeSubTab === 'affiliate_deals') {
      if (parsedAffDeals.length === 0) return;
      parsedAffDeals.forEach(deal => {
        onAddAffiliateDeal(deal);
      });
      setImportSuccessCount(parsedAffDeals.length);
      setParsedAffDeals([]);
      setImportError(null);
      setTimeout(() => {
        setImportSuccessCount(null);
      }, 4000);
      return;
    }

    if (parsedProducts.length === 0) return;
    parsedProducts.forEach(prod => {
      onAddProduct(prod);
    });
    setImportSuccessCount(parsedProducts.length);
    setParsedProducts([]);
    setImportError(null);
    setTimeout(() => {
      setImportSuccessCount(null);
    }, 4000);
  };


  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand || !newProdAmazon) return;

    const amazonPrice = Number(newProdAmazon);
    const flipPrice = newProdFlipkart ? Number(newProdFlipkart) : amazonPrice * 1.02;

    const newProduct: Product = {
      id: `lap-custom-${Date.now()}`,
      name: newProdName,
      brand: newProdBrand,
      category: newProdCategory === 'travel' ? 'electronics' : (newProdCategory as any),
      subcategory: newProdSubcategory,
      rating: Number(newProdRating),
      reviewCount: 1,
      image: newProdImg,
      description: newProdDesc || `${newProdName} is a top-tier premium hardware solution built with precision.`,
      stores: [
        { name: 'Amazon', price: amazonPrice, oldPrice: Math.round(amazonPrice * 1.2), url: 'https://amazon.in' },
        { name: 'Flipkart', price: Math.round(flipPrice), oldPrice: Math.round(flipPrice * 1.18), url: 'https://flipkart.com' }
      ],
      priceHistory: [
        { date: '2026-05-01', price: Math.round(amazonPrice * 1.1) },
        { date: '2026-06-01', price: amazonPrice }
      ],
      pros: newProdPros.split(';').map(p => p.trim()),
      cons: newProdCons.split(';').map(c => c.trim()),
      featured: true,
      todayDeal: true,
      priceDropToday: true
    };

    onAddProduct(newProduct);
    setProductSuccess(true);
    
    // reset
    setNewProdName('');
    setNewProdBrand('');
    setNewProdAmazon('');
    setNewProdFlipkart('');
    setNewProdDesc('');
    setTimeout(() => setProductSuccess(false), 4000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupCode || !newCoupDesc) return;

    const newCoupon: Coupon = {
      id: `c-custom-${Date.now()}`,
      store: newCoupStore,
      code: newCoupCode,
      discount: newCoupDiscount,
      description: newCoupDesc,
      expiry: '2026-12-31'
    };

    onAddCoupon(newCoupon);
    setCouponSuccess(true);
    setNewCoupCode('');
    setNewCoupDesc('');
    setTimeout(() => setCouponSuccess(false), 4000);
  };

  const handleCreateAffiliateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffAdvertiser || !newAffName || !newAffClickUrl) return;

    const newDeal: AffiliateDeal = {
      id: `aff-custom-${Date.now()}`,
      advertiser: newAffAdvertiser,
      name: newAffName,
      description: newAffDescription,
      clickUrl: newAffClickUrl,
      couponCode: newAffCouponCode,
      category: newAffCategory,
      linkId: newAffLinkId || `id-${Date.now()}`,
      targetedCountries: newAffTargetedCountries,
      threeMonthEpc: newAffThreeMonthEpc || "N/A",
      sevenDayEpc: newAffSevenDayEpc || "N/A",
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      keywords: "",
      linkType: "Text Link"
    };

    onAddAffiliateDeal(newDeal);
    setAffDealSuccess(true);
    
    // reset
    setNewAffAdvertiser('');
    setNewAffName('');
    setNewAffDescription('');
    setNewAffClickUrl('');
    setNewAffCouponCode('');
    setNewAffLinkId('');
    setNewAffTargetedCountries('');
    setNewAffThreeMonthEpc('');
    setNewAffSevenDayEpc('');
    setTimeout(() => setAffDealSuccess(false), 4000);
  };


  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Banner */}
      <div className="rounded-3xl bg-slate-900 p-8 md:p-12 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide">
            Staff Portal Only
          </span>
          <h1 className="text-3xl font-black tracking-tight leading-none">TheDeals24 Admin Dashboard</h1>
          <p className="text-sm text-slate-400 font-sans max-w-xl">
            Add hot shopping alerts, manage affiliate store pricing matrixes, publish coupon codes, and monitor user alert triggers.
          </p>
        </div>

        <div className="flex gap-4 relative z-10 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl text-center backdrop-blur">
            <span className="text-[10px] text-slate-400 block font-mono">ACTIVE ALERTS</span>
            <span className="text-2xl font-black text-indigo-400 font-mono">{alerts.length}</span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl text-center backdrop-blur">
            <span className="text-[10px] text-slate-400 block font-mono">PRODUCTS COUNT</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{products.length}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`pb-3 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'products'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Manage Catalog
        </button>
        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`pb-3 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'coupons'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Manage Coupons
        </button>
        <button
          onClick={() => setActiveSubTab('affiliate_deals')}
          className={`pb-3 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'affiliate_deals'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Manage Affiliate Deals
        </button>
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-3 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Revenue & Analytics
        </button>
      </div>

      {/* Sub Tab contents */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create product / Bulk Upload form column */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            {/* Toggle uploader mode */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100/80">
              <button
                type="button"
                onClick={() => { setUploadMode('manual'); setImportError(null); }}
                className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadMode === 'manual'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" /> Manual Insert
              </button>
              <button
                type="button"
                onClick={() => { setUploadMode('excel'); setProductSuccess(false); }}
                className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadMode === 'excel'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Excel/CSV Upload
              </button>
            </div>

            {uploadMode === 'manual' ? (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-indigo-600" /> Insert New Product
                </h3>

                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., iPhone 17"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Brand</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Apple"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Category</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                      >
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="grocery">Grocery</option>
                        <option value="software">Software</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Subcategory</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Mobiles, Laptops"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newProdSubcategory}
                        onChange={(e) => setNewProdSubcategory(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Amazon (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 59999"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newProdAmazon}
                        onChange={(e) => setNewProdAmazon(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Flipkart (₹)</label>
                      <input
                        type="number"
                        placeholder="Optional"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newProdFlipkart}
                        onChange={(e) => setNewProdFlipkart(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Product Image / Emoji</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 💻 or https://..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newProdImg}
                        onChange={(e) => setNewProdImg(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Pros (separate with semicolon ';')</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newProdPros}
                      onChange={(e) => setNewProdPros(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Cons (separate with semicolon ';')</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newProdCons}
                      onChange={(e) => setNewProdCons(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Short marketing details..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    Publish To Catalog <Plus className="w-4 h-4" />
                  </button>
                </form>

                {productSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-800">Product added to database!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Bulk Excel Import
                  </h3>
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer border border-emerald-100 transition-colors"
                    title="Download Excel spreadsheet template"
                  >
                    <Download className="w-3.5 h-3.5" /> Template
                  </button>
                </div>

                {/* Drag and drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) parseFile(file);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleExcelUpload}
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Drag & drop spreadsheet here</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Supports .xlsx, .xls, .csv files</span>
                    </div>
                    <span className="inline-block text-[10px] font-bold bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 shadow-xs">
                      Browse Files
                    </span>
                  </div>
                </div>

                {/* Expected columns helper */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Expected Headers (Case-insensitive)</span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                    <strong>Name</strong>, <strong>Brand</strong>, Category, Subcategory, Amazon Price, Flipkart Price, Croma Price, Rating, <strong>Emoji Icon / Image URL</strong>, Description, Pros, Cons
                  </p>
                </div>

                {importError && (
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-[10px] font-medium text-amber-800 leading-normal">{importError}</span>
                  </div>
                )}

                {importSuccessCount !== null && (
                  <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-800">
                      Successfully imported {importSuccessCount} products!
                    </span>
                  </div>
                )}

                {/* Parsed List Preview */}
                {parsedProducts.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Parsed {parsedProducts.length} Items Preview:
                      </span>
                      <button
                        onClick={() => setParsedProducts([])}
                        className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Clear
                      </button>
                    </div>

                    <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-50 pr-1">
                      {parsedProducts.map((p, i) => (
                        <div key={i} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                              <ProductImage 
                                imageSrc={p.image} 
                                category={p.category} 
                                alt={p.name}
                                className="max-w-full max-h-full object-contain"
                                emojiClassName="text-xl select-none"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-slate-900 font-bold block truncate max-w-[150px]">{p.name}</span>
                              <span className="text-[10px] text-slate-400 block">{p.brand} • {p.subcategory}</span>
                            </div>
                          </div>
                          <div className="text-right font-mono text-[10px] font-bold text-slate-700 shrink-0">
                            ₹{p.stores[0]?.price.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleCommitImport}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Import {parsedProducts.length} Products
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current products list */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Current Store Catalog</h3>
            
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-2">
              {products.map((p) => {
                const amazonStore = p.stores.find(s => s.name === 'Amazon');
                return (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        <ProductImage 
                          imageSrc={p.image} 
                          category={p.category} 
                          alt={p.name}
                          className="max-w-full max-h-full object-contain"
                          emojiClassName="text-2xl select-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">{p.brand} • {p.subcategory}</span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{p.name}</h4>
                        <span className="text-[10px] text-indigo-600 font-bold block">Amazon price: ₹{amazonStore ? amazonStore.price.toLocaleString() : 'N/A'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-2 border border-slate-100 hover:border-slate-200 hover:text-rose-500 text-slate-400 rounded-lg cursor-pointer transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create coupon form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <Tag className="w-5 h-5 text-indigo-600" /> Publish Store Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Store / Brand</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={newCoupStore}
                  onChange={(e) => setNewCoupStore(e.target.value)}
                >
                  <option value="Amazon">Amazon</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Croma">Croma</option>
                  <option value="Hostinger">Hostinger</option>
                  <option value="NordVPN">NordVPN</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GET300"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={newCoupCode}
                    onChange={(e) => setNewCoupCode(e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Discount Text</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10% OFF"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={newCoupDiscount}
                    onChange={(e) => setNewCoupDiscount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Voucher Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Applies on orders over ₹1,999..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={newCoupDesc}
                  onChange={(e) => setNewCoupDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                Publish Coupon <Plus className="w-4 h-4" />
              </button>
            </form>

            {couponSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-800">Coupon published successfully!</span>
              </div>
            )}
          </div>

          {/* Current coupons list */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Current Store Coupons ({coupons.length})</h3>
            
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {coupons.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full font-mono uppercase mr-2">{c.store}</span>
                    <span className="text-emerald-600 text-xs font-bold">{c.discount}</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{c.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Code: {c.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'affiliate_deals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Affiliate Deal form */}
          <div className="lg:col-span-5 space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <Tag className="w-5 h-5 text-indigo-600" /> Add Affiliate / Advertiser Entry
              </h3>

              <form onSubmit={handleCreateAffiliateDeal} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Advertiser Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FragranceShop.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={newAffAdvertiser}
                    onChange={(e) => setNewAffAdvertiser(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Deal Name / Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Designer Fragrance Sale"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newAffName}
                      onChange={(e) => setNewAffName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Fragrance, Cosmetics"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newAffCategory}
                      onChange={(e) => setNewAffCategory(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Click URL / Redirect Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://www.dpbolvw.net/click..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={newAffClickUrl}
                    onChange={(e) => setNewAffClickUrl(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Coupon Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. SAVE20"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newAffCouponCode}
                      onChange={(e) => setNewAffCouponCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Link ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 16942202"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newAffLinkId}
                      onChange={(e) => setNewAffLinkId(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Deal Description</label>
                  <textarea
                    rows={2}
                    placeholder="Explore wide selection of beauty items..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={newAffDescription}
                    onChange={(e) => setNewAffDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase font-mono mb-1">Countries</label>
                    <input
                      type="text"
                      placeholder="US, IN"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newAffTargetedCountries}
                      onChange={(e) => setNewAffTargetedCountries(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase font-mono mb-1">3M EPC</label>
                    <input
                      type="text"
                      placeholder="$24.75 USD"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newAffThreeMonthEpc}
                      onChange={(e) => setNewAffThreeMonthEpc(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase font-mono mb-1">7D EPC</label>
                    <input
                      type="text"
                      placeholder="$46.00 USD"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newAffSevenDayEpc}
                      onChange={(e) => setNewAffSevenDayEpc(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  Create Affiliate Deal <Plus className="w-4 h-4" />
                </button>
              </form>

              {affDealSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center flex items-center justify-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-800">Affiliate deal added successfully!</span>
                </div>
              )}
            </div>

            {/* Bulk Upload Box */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Bulk Excel/CSV Import
              </h3>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) parseFile(file);
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleExcelUpload}
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Drag & drop affiliate deals sheet here</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Supports advertiser CSV, Excel, TXT</span>
                  </div>
                  <span className="inline-block text-[10px] font-bold bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 shadow-xs">
                    Browse Files
                  </span>
                </div>
              </div>

              {/* Expected headers */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Recognized Columns:</span>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  <strong>ADVERTISER</strong>, <strong>NAME</strong>, <strong>CLICK URL</strong> (or Html Link), <strong>DESCRIPTION</strong>, CATEGORY, COUPON CODE, TARGETED COUNTRIES, THREE MONTH EPC, SEVEN DAY EPC
                </p>
              </div>

              {importError && (
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-medium text-amber-800 leading-normal">{importError}</span>
                </div>
              )}

              {importSuccessCount !== null && (
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-800">
                    Successfully imported {importSuccessCount} affiliate deals!
                  </span>
                </div>
              )}

              {/* Parsed List Preview */}
              {parsedAffDeals.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">
                      Parsed {parsedAffDeals.length} Deals Preview:
                    </span>
                    <button
                      onClick={() => setParsedAffDeals([])}
                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Clear
                    </button>
                  </div>

                  <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-50 pr-1">
                    {parsedAffDeals.map((d, i) => (
                      <div key={i} className="py-2 flex items-center justify-between text-xs">
                        <div className="min-w-0 flex-1">
                          <span className="text-slate-900 font-bold block truncate">{d.name}</span>
                          <span className="text-[10px] text-slate-400 block">{d.advertiser} • {d.category}</span>
                        </div>
                        <div className="text-right text-[10px] text-slate-500 shrink-0">
                          {d.threeMonthEpc || 'N/A'} EPC
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleCommitImport}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Import {parsedAffDeals.length} Affiliate Deals
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current affiliate deals list */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Current Advertiser / Affiliate Deals ({affiliateDeals.length})</h3>
            
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-2">
              {affiliateDeals.map((d) => (
                <div key={d.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full font-mono uppercase shrink-0">
                        {d.advertiser}
                      </span>
                      {d.couponCode && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                          Code: {d.couponCode}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        Cat: {d.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{d.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{d.description}</p>
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                      <span>LinkId: {d.linkId || 'N/A'}</span>
                      {d.threeMonthEpc && <span>3M EPC: {d.threeMonthEpc}</span>}
                      {d.targetedCountries && <span>Target: {d.targetedCountries}</span>}
                    </div>

                    <a 
                      href={d.clickUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-indigo-600 hover:underline break-all block pt-1"
                    >
                      {d.clickUrl}
                    </a>
                  </div>

                  <button
                    onClick={() => onDeleteAffiliateDeal(d.id)}
                    className="p-2 border border-slate-100 hover:border-slate-200 hover:text-rose-500 text-slate-400 rounded-lg cursor-pointer transition-colors shrink-0"
                    title="Remove affiliate deal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {affiliateDeals.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No affiliate deals found. Upload some using Excel or add them manually.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="space-y-8">
          {/* Main figures */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'AFFILIATE REVENUE', value: '₹1,24,500', sub: '+15.4% this month', icon: <DollarSign className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'GOOGLE ADSENSE', value: '₹34,800', sub: 'Based on 1.2M pageviews', icon: <BarChart2 className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100' },
              { label: 'SPONSORED PLACEMENTS', value: '₹45,000', sub: 'Dell, Hostinger partner deals', icon: <Tag className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-100' },
              { label: 'NEWSLETTER SUBSCRIBERS', value: '18,400', sub: '+1,200 organic signups/wk', icon: <Bell className="w-5 h-5 text-indigo-600" />, bg: 'bg-slate-50 border-slate-100' }
            ].map((stat, i) => (
              <div key={i} className={`p-5 rounded-2xl border flex items-start justify-between ${stat.bg}`}>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">{stat.label}</span>
                  <span className="text-2xl font-black text-slate-900 font-mono block leading-none">{stat.value}</span>
                  <p className="text-[10px] text-slate-500 font-medium">{stat.sub}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl shadow-xs shrink-0">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Revenue breakdown notes */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Primary Revenue Streams Explained</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              By offering rich comparison data (Amazon, Flipkart, Croma), detailed Pros & Cons charts, verified coupons, and an interactive AI Assistant, TheDeals24 builds substantial user trust. Instead of bouncing, visitors actively bookmark the site, creating high recurring direct visits. Revenue is diversified across **Affiliate Commissions** (redirecting buyers), **Sponsor placements** (premium placements for featured brands like Hostinger or SBI Card), and **Newsletter monetization** (weekly top drops sponsor ads).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
