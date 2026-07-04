import React, { useState } from 'react';
import { Product } from '../types';
import ProductImage from './ProductImage';
import { 
  ArrowLeftRight, Trash2, Plus, Star, Sparkles, CheckCircle2, AlertCircle, ShoppingCart, HelpCircle, ExternalLink, Search, Loader2, Info
} from 'lucide-react';

interface CompareViewProps {
  products: Product[];
  compareProductIds: string[];
  onToggleCompare: (productId: string) => void;
  onClearCompare: () => void;
  onSetTab: (tab: string) => void;
  onSendMessage?: (text: string) => void;
  onAddWebProduct?: (product: Product) => void;
}

export default function CompareView({
  products,
  compareProductIds,
  onToggleCompare,
  onClearCompare,
  onSetTab,
  onSendMessage,
  onAddWebProduct,
}: CompareViewProps) {
  const [selectedAddProductId, setSelectedAddProductId] = useState('');
  const [webQuery, setWebQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchSuccess, setSearchSuccess] = useState(false);

  const comparedProducts = products.filter(p => compareProductIds.includes(p.id));

  // Find other products available to add (not currently in compared list)
  const availableToCompare = products.filter(p => !compareProductIds.includes(p.id));

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddProductId) return;
    onToggleCompare(selectedAddProductId);
    setSelectedAddProductId('');
  };

  const handleWebSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchSuccess(false);

    // Dynamic rotating statuses to keep users engaged and informed of AI actions
    const messages = [
      'Initializing Amazon & Flipkart Web Search crawler...',
      'Searching Amazon India & Flipkart for verified matches...',
      'Comparing current stock prices & discount rates...',
      'Grounded AI parsing user reviews, pros, and cons...',
      'Compiling price history charts & full details...'
    ];

    let msgIndex = 0;
    setSearchStatus(messages[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setSearchStatus(messages[msgIndex]);
    }, 1800);

    try {
      const response = await fetch('/api/search-web-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: webQuery.trim() }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (response.ok && data.success && data.product) {
        setSearchSuccess(true);
        setWebQuery('');
        if (onAddWebProduct) {
          onAddWebProduct(data.product);
        }
        // Auto-scroll to comparison table
        setTimeout(() => {
          setSearchSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to search product details.');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setSearchError(err.message || 'Unable to fetch details. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getLowestPriceStore = (product: Product) => {
    if (!product.stores || product.stores.length === 0) return null;
    return product.stores.reduce((lowest, current) => 
      current.price < lowest.price ? current : lowest
    , product.stores[0]);
  };

  const handleAiAnalyze = () => {
    if (comparedProducts.length === 0 || !onSendMessage) return;
    
    const names = comparedProducts.map(p => `"${p.name}" (${p.brand})`).join(' vs ');
    const query = `Please provide an objective, detailed side-by-side comparison of ${names}. Which one offers the best value-for-money, what are the key differences, and which should I choose depending on my needs?`;
    
    onSendMessage(query);
    onSetTab('chat');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Compare Products</h2>
          </div>
          <p className="text-xs text-slate-500">
            Compare specs, user ratings, pros/cons, and live prices side-by-side to find the absolute best deals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {comparedProducts.length > 0 && (
            <button
              onClick={onClearCompare}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All ({comparedProducts.length})
            </button>
          )}

          {comparedProducts.length >= 2 && onSendMessage && (
            <button
              onClick={handleAiAnalyze}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Compare with AI
            </button>
          )}
        </div>
      </div>

      {/* Dual Insertion Options Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Amazon & Flipkart Grounded Search Bar */}
        <div className="lg:col-span-7 bg-indigo-950 text-white rounded-3xl p-6 shadow-md border border-indigo-900 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white p-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                  Grounded AI Search
                </span>
                <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Amazon & Flipkart India Live
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight leading-tight">Live Web Search & Compare</h3>
              <p className="text-xs text-indigo-200 leading-relaxed max-w-lg">
                Type any product name. Our AI assistant will run a grounded web search across Amazon India and Flipkart to fetch real-time prices, ratings, and expert pros/cons.
              </p>
            </div>

            <form onSubmit={handleWebSearch} className="space-y-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-2xl p-1.5 border border-white/10 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
                <Search className="w-4 h-4 text-indigo-300 ml-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. iPhone 16, Sony WH-1000XM5, Samsung S24..."
                  value={webQuery}
                  onChange={(e) => setWebQuery(e.target.value)}
                  disabled={isSearching}
                  className="bg-transparent text-xs text-white placeholder:text-indigo-300/60 focus:outline-none w-full py-1.5 px-1"
                />
                <button
                  type="submit"
                  disabled={isSearching || !webQuery.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    isSearching || !webQuery.trim()
                      ? 'bg-indigo-900 text-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg cursor-pointer'
                  }`}
                >
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Search Live
                </button>
              </div>

              {/* Error Alert */}
              {searchError && (
                <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-200 p-3 rounded-xl text-[11px] leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400 mt-0.5" />
                  <span>{searchError}</span>
                </div>
              )}

              {/* Loading Status Updates */}
              {isSearching && (
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 text-xs text-indigo-200 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>{searchStatus}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full w-2/3 rounded-full animate-infiniteProgress" />
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {searchSuccess && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-3 rounded-xl text-xs font-semibold animate-slideUp">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Product found & loaded side-by-side in comparison view!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Local Products Quick-Add Dropdown */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] bg-slate-100 font-extrabold text-slate-500 px-2.5 py-0.5 rounded-full inline-block uppercase tracking-wider">
                Browse catalog
              </span>
              <h3 className="text-base font-extrabold text-slate-900">Add from Local Feed</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add trending options from our pre-curated website deals feed directly to the side-by-side comparator tool.
              </p>
            </div>

            {availableToCompare.length > 0 && comparedProducts.length < 4 ? (
              <form onSubmit={handleAddProduct} className="space-y-2.5">
                <select
                  value={selectedAddProductId}
                  onChange={(e) => setSelectedAddProductId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select a catalog product...</option>
                  {availableToCompare.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.brand}] {p.name} (₹{Math.min(...p.stores.map(s => s.price)).toLocaleString()})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={!selectedAddProductId}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedAddProductId 
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-sm' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Add to Comparator
                </button>
              </form>
            ) : comparedProducts.length >= 4 ? (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-[11px] leading-relaxed flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>You can compare a maximum of 4 products. Please remove one from the table to add another.</span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 text-xs text-center">
                All catalog products added! Try the web search box on the left.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      {comparedProducts.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
            ⚖️
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">No products chosen for comparison</h3>
            <p className="text-xs text-slate-500">
              Type any product in the **Grounded AI Search** box or select from the local catalog list above to build your comparison.
            </p>
          </div>
          <button
            onClick={() => onSetTab('home')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors inline-block"
          >
            Browse Products Feed
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
          {/* Scrollable Container */}
          <div className="overflow-x-auto">
            <div 
              className="min-w-[640px] divide-y divide-slate-100"
              style={{
                display: 'grid',
                gridTemplateColumns: `160px repeat(${comparedProducts.length}, 1fr)`
              }}
            >
              {/* ROW 1: Header / Product Cards */}
              <div className="bg-slate-50/50 p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Product Info
              </div>
              {comparedProducts.map(p => (
                <div key={p.id} className="p-4 relative space-y-3 group border-l border-slate-100">
                  <button
                    onClick={() => onToggleCompare(p.id)}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from comparison"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto p-1.5 overflow-hidden">
                    <ProductImage 
                      imageSrc={p.image} 
                      category={p.category} 
                      alt={p.name}
                      className="max-w-full max-h-full object-contain"
                      emojiClassName="text-4xl"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="inline-block text-[9px] bg-slate-100 font-extrabold text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {p.brand}
                      </span>
                      {p.id.startsWith('web-') && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded-full border border-indigo-100">
                          <Sparkles className="w-2.5 h-2.5" /> LIVE SEARCHED
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-900 leading-tight line-clamp-2 min-h-[32px]">
                      {p.name}
                    </h3>
                  </div>
                </div>
              ))}

              {/* ROW 2: Best Deal / Lowest Price */}
              <div className="p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Best Price
              </div>
              {comparedProducts.map(p => {
                const best = getLowestPriceStore(p);
                return (
                  <div key={p.id} className="p-4 border-l border-slate-100 space-y-1">
                    {best ? (
                      <>
                        <div className="text-lg font-black text-emerald-600 font-mono">
                          ₹{best.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                          <span>via {best.name}</span>
                          <span className="text-emerald-500 bg-emerald-50 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-sans">
                            Best Deal
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">N/A</span>
                    )}
                  </div>
                );
              })}

              {/* ROW 3: Specs category / Subcategory */}
              <div className="p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Subcategory
              </div>
              {comparedProducts.map(p => (
                <div key={p.id} className="p-4 border-l border-slate-100 text-xs font-semibold text-slate-700 flex items-center">
                  {p.subcategory}
                </div>
              ))}

              {/* ROW 4: Ratings */}
              <div className="p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Reviews & Rating
              </div>
              {comparedProducts.map(p => (
                <div key={p.id} className="p-4 border-l border-slate-100 space-y-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="text-xs font-extrabold text-slate-900 font-mono">{p.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">({p.reviewCount} user benchmark ratings)</span>
                </div>
              ))}

              {/* ROW 5: Pros comparison */}
              <div className="p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Pros
              </div>
              {comparedProducts.map(p => (
                <div key={p.id} className="p-4 border-l border-slate-100 text-left space-y-1">
                  {p.pros && p.pros.length > 0 ? (
                    p.pros.map((pro, index) => (
                      <div key={index} className="flex items-start gap-1 text-[10px] text-slate-600 leading-tight">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[10px] italic">No pros verified yet</span>
                  )}
                </div>
              ))}

              {/* ROW 6: Cons comparison */}
              <div className="p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Cons
              </div>
              {comparedProducts.map(p => (
                <div key={p.id} className="p-4 border-l border-slate-100 text-left space-y-1">
                  {p.cons && p.cons.length > 0 ? (
                    p.cons.map((con, index) => (
                      <div key={index} className="flex items-start gap-1 text-[10px] text-slate-600 leading-tight">
                        <AlertCircle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[10px] italic">No critical cons verified</span>
                  )}
                </div>
              ))}

              {/* ROW 7: Detailed Store Pricing Matrix */}
              <div className="p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Stores Live Prices
              </div>
              {comparedProducts.map(p => (
                <div key={p.id} className="p-4 border-l border-slate-100 space-y-2">
                  {p.stores.map((st, sidx) => (
                    <a
                      key={sidx}
                      href={st.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-100 px-2 py-1.5 rounded-xl transition-colors font-medium text-slate-700"
                    >
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${st.name === 'Flipkart' ? 'bg-amber-400' : 'bg-orange-500'}`} />
                        {st.name}
                      </span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                        <span>₹{st.price.toLocaleString()}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              ))}

              {/* ROW 8: Description */}
              <div className="p-4 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Brief details
              </div>
              {comparedProducts.map(p => (
                <div key={p.id} className="p-4 border-l border-slate-100 text-[11px] text-slate-500 leading-relaxed font-sans max-w-xs">
                  {p.description || "No full description added yet."}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
