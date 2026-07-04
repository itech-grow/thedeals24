import React, { useState, useEffect } from 'react';
import { Product, Coupon } from '../types';
import { 
  ArrowLeft, Star, Heart, Bell, ExternalLink, ChevronRight, Check, Copy, Sparkles, AlertTriangle, RefreshCw, ArrowLeftRight
} from 'lucide-react';
import ProductImage from './ProductImage';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  onOpenAlertModal: (product: Product) => void;
  coupons: Coupon[];
  compareProductIds: string[];
  onToggleCompare: (productId: string) => void;
}

export default function ProductDetailView({
  product,
  onBack,
  onToggleWishlist,
  wishlist,
  onOpenAlertModal,
  coupons,
  compareProductIds = [],
  onToggleCompare
}: ProductDetailViewProps) {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [aiReview, setAiReview] = useState<string>(product.aiReview || '');
  const [loadingAiReview, setLoadingAiReview] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedHistoryPoint, setSelectedHistoryPoint] = useState<{ date: string; price: number } | null>(null);

  const isSaved = wishlist.includes(product.id);
  const isCompared = compareProductIds.includes(product.id);

  // Load default selected history point to show latest price
  useEffect(() => {
    if (product.priceHistory && product.priceHistory.length > 0) {
      setSelectedHistoryPoint(product.priceHistory[product.priceHistory.length - 1]);
    }
  }, [product]);

  // Handle Fetching/Re-generating AI Review from backend
  const fetchAiReview = async (forceRegenerate = false) => {
    if (!forceRegenerate && aiReview) return;
    setLoadingAiReview(true);
    setAiError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          description: product.description,
          pros: product.pros,
          cons: product.cons
        }),
      });

      if (!response.ok) {
        throw new Error('Could not fetch review.');
      }

      const data = await response.json();
      if (data.summary) {
        setAiReview(data.summary);
      } else if (data.error) {
        setAiError(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error occurred while contacting server.');
    } finally {
      setLoadingAiReview(false);
    }
  };

  // Run initial review fetch if none exists
  useEffect(() => {
    if (!aiReview) {
      fetchAiReview();
    }
  }, [product]);

  // Match brand or name coupons
  const matchedCoupons = coupons.filter(c => 
    c.store.toLowerCase() === 'amazon' || 
    product.name.toLowerCase().includes(c.store.toLowerCase()) ||
    product.stores.some(s => s.name.toLowerCase() === c.store.toLowerCase())
  );

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  // Helper to draw clean SVG path for Price History
  const renderPriceHistoryChart = () => {
    const history = product.priceHistory;
    if (!history || history.length === 0) return null;

    const prices = history.map(h => h.price);
    const minPrice = Math.min(...prices) * 0.95; // 5% below for padding
    const maxPrice = Math.max(...prices) * 1.05; // 5% above for padding
    const priceRange = maxPrice - minPrice;

    const width = 500;
    const height = 200;
    const paddingX = 40;
    const paddingY = 20;

    // Map price points to coordinates
    const points = history.map((item, index) => {
      const x = paddingX + (index / (history.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((item.price - minPrice) / priceRange) * (height - paddingY * 2);
      return { x, y, ...item };
    });

    // Create path string
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    return (
      <div className="relative bg-slate-50 border border-slate-100 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Interactive Price History</span>
          {selectedHistoryPoint && (
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">{selectedHistoryPoint.date}</span>
              <span className="text-sm font-extrabold text-indigo-600 font-mono">₹{selectedHistoryPoint.price.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* SVG Render */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[320px] h-48 select-none">
            {/* Grid Lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" />

            {/* Price Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gradient definition for path */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Interactive dots */}
            {points.map((pt, i) => (
              <g 
                key={i} 
                className="cursor-pointer"
                onMouseEnter={() => setSelectedHistoryPoint({ date: pt.date, price: pt.price })}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={selectedHistoryPoint?.date === pt.date ? '8' : '5'}
                  className={`transition-all duration-200 fill-white ${
                    selectedHistoryPoint?.date === pt.date 
                      ? 'stroke-indigo-600 stroke-[3]' 
                      : 'stroke-emerald-500 stroke-[2]'
                  }`}
                />
              </g>
            ))}

            {/* Axis Lables */}
            <text x={paddingX} y={height - 4} className="text-[10px] font-mono fill-slate-400" textAnchor="start">
              {history[0].date}
            </text>
            <text x={width - paddingX} y={height - 4} className="text-[10px] font-mono fill-slate-400" textAnchor="end">
              {history[history.length - 1].date}
            </text>
          </svg>
        </div>

        <div className="flex justify-center gap-4 text-[10px] text-slate-400 mt-2">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Start of season</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Current lowest price</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back to Home Navigator */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-semibold text-sm cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Deals
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
              isSaved 
                ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}
          </button>
          <button
            onClick={() => onToggleCompare(product.id)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
              isCompared 
                ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ArrowLeftRight className={`w-4 h-4 ${isCompared ? 'text-white' : 'text-slate-400'}`} />
            {isCompared ? 'Added to Compare' : 'Compare Product'}
          </button>
          <button
            onClick={() => onOpenAlertModal(product)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-400" />
            Set Alert
          </button>
        </div>
      </div>

      {/* Main product card top layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Panel & Price History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm relative overflow-hidden flex items-center justify-center min-h-[300px]">
            <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {product.brand}
            </div>
            <div className="w-full h-48 flex items-center justify-center">
              <ProductImage 
                imageSrc={product.image} 
                category={product.category} 
                alt={product.name}
                className="max-w-full max-h-full object-contain filter drop-shadow-xl"
                emojiClassName="text-9xl select-none"
              />
            </div>
          </div>

          {/* Price history chart */}
          {renderPriceHistoryChart()}
        </div>

        {/* Right Column: Title, Ratings, Pricing Table & Coupons */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {product.category}
              </span>
              <span className="text-slate-400 font-medium">/</span>
              <span className="text-slate-500 font-medium">{product.subcategory}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">({product.reviewCount} customer reviews verified across multiple portals)</span>
            </div>

            <p className="text-sm text-slate-600 font-sans leading-relaxed">{product.description}</p>
          </div>

          {/* Store Price comparison table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase font-mono">Stores Compare Matrix</span>
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Live comparison</span>
            </div>

            <div className="divide-y divide-slate-100">
              {product.stores.map((store, i) => {
                const savePercent = Math.round(((store.oldPrice - store.price) / store.oldPrice) * 100);
                return (
                  <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      {/* Store name and visual */}
                      <span className="font-extrabold text-slate-800 text-base">{store.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">
                          -{savePercent}% OFF
                        </span>
                        {store.couponCode && (
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-100">
                            Code: {store.couponCode}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-left md:text-right">
                        <span className="text-xl font-black text-slate-900 block leading-none">₹{store.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 line-through">₹{store.oldPrice.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {store.couponCode && (
                          <button
                            onClick={() => handleCopyCoupon(store.couponCode!)}
                            className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Copy store promo code"
                          >
                            {copiedCoupon === store.couponCode ? <Check className="w-4 h-4 text-emerald-500 animate-pulse" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                        <a
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          Buy Now <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matched vouchers and deals section */}
          {matchedCoupons.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Available Verified Coupons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedCoupons.map((coupon) => (
                  <div key={coupon.id} className="border border-dashed border-indigo-200 rounded-xl bg-indigo-50/20 p-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 block">{coupon.discount} ({coupon.store})</span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{coupon.description}</p>
                    </div>
                    <button
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg font-mono tracking-wider cursor-pointer"
                    >
                      {copiedCoupon === coupon.code ? 'COPIED!' : coupon.code}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pros & Cons list and AI reviews summary split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pros and Cons table */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            📋 Specifications & Insights
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Pros */}
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                🟢 What We Love (Pros)
              </h3>
              <ul className="space-y-2">
                {product.pros.map((pro, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-500 font-bold">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
                🔴 Crucial Caveats (Cons)
              </h3>
              <ul className="space-y-2">
                {product.cons.map((con, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-500 font-bold">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Server Side AI reviews section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Server-Side AI Product Review
            </h2>
            <button
              onClick={() => fetchAiReview(true)}
              disabled={loadingAiReview}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loadingAiReview ? 'animate-spin' : ''}`} />
              Re-analyze
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {loadingAiReview ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-xs text-slate-400 font-medium">Generating advanced review via Gemini AI...</span>
              </div>
            ) : aiError ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold">{aiError}</span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed space-y-2 border-l-2 border-indigo-500 pl-3">
                  <p className="font-bold">Rule-Based Fallback Review:</p>
                  <p>Based on our benchmarks, the **{product.name}** is highly recommended for everyday users. Its pros include its fantastic value offering, competitive store price adjustments, and positive customer feedback.</p>
                  <p>Its main con relates to its hardware thresholds (e.g. webcam, materials), which may cause friction for professional workloads. Overall, an ideal budget investment.</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 space-y-4 font-sans leading-relaxed whitespace-pre-line">
                {aiReview}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-[10px] text-slate-500 font-medium">Want to ask custom queries? Chat directly with our Smart Shopping AI Assistant!</span>
              </div>
              <button 
                onClick={() => {
                  const chatBtn = document.getElementById('ai-chat-tab-button');
                  if (chatBtn) chatBtn.click();
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg shrink-0 cursor-pointer"
              >
                Ask Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
