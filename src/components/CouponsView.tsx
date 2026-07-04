import React, { useState } from 'react';
import { Coupon, AffiliateDeal } from '../types';
import { Tag, Search, Copy, Check, Sparkles, Clock, Calendar, Globe, ArrowUpRight } from 'lucide-react';

interface CouponsViewProps {
  coupons: Coupon[];
  affiliateDeals?: AffiliateDeal[];
}

export default function CouponsView({ coupons, affiliateDeals = [] }: CouponsViewProps) {
  const [activeTab, setActiveTab] = useState<'coupons' | 'affiliate'>('coupons');
  
  // Coupons filtering states
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [couponSearchQuery, setCouponSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Affiliate Deals filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [affSearchQuery, setAffSearchQuery] = useState<string>('');
  const [copiedAffCode, setCopiedAffCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCopyAff = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedAffCode(code);
    setTimeout(() => setCopiedAffCode(null), 3000);
  };

  const stores = ['all', ...Array.from(new Set(coupons.map(c => c.store)))];
  
  const categories = ['all', ...Array.from(new Set(affiliateDeals.map(d => d.category).filter(Boolean)))];

  const filteredCoupons = coupons.filter(coupon => {
    const matchesStore = selectedStore === 'all' || coupon.store === selectedStore;
    const matchesQuery = coupon.store.toLowerCase().includes(couponSearchQuery.toLowerCase()) ||
                          coupon.description.toLowerCase().includes(couponSearchQuery.toLowerCase()) ||
                          coupon.code.toLowerCase().includes(couponSearchQuery.toLowerCase());
    return matchesStore && matchesQuery;
  });

  const filteredAffDeals = affiliateDeals.filter(deal => {
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    const matchesQuery = deal.advertiser.toLowerCase().includes(affSearchQuery.toLowerCase()) ||
                          deal.name.toLowerCase().includes(affSearchQuery.toLowerCase()) ||
                          deal.description.toLowerCase().includes(affSearchQuery.toLowerCase()) ||
                          (deal.keywords && deal.keywords.toLowerCase().includes(affSearchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-pink-950 p-8 md:p-12 text-white border border-rose-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-rose-500/25 border border-rose-400/30 text-rose-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Hot Promo Codes & Deals</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Instant Active Coupon Code drops & Direct Store Deals</h1>
          <p className="text-sm text-rose-200 font-sans leading-relaxed">
            Copy discount codes or click to redeem official advertiser promotions. Claim the lowest possible checkouts on tech, beauty, fashion, and accessories.
          </p>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
            activeTab === 'coupons'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Voucher Code Drops
        </button>
        <button
          onClick={() => setActiveTab('affiliate')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
            activeTab === 'affiliate'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Advertiser Affiliate Deals ({affiliateDeals.length})
        </button>
      </div>

      {activeTab === 'coupons' ? (
        <div className="space-y-8">
          {/* Filter and search bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-5">
            {/* Store Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
              {stores.map((store) => (
                <button
                  key={store}
                  onClick={() => setSelectedStore(store)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedStore === store
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 bg-white border border-slate-100'
                  }`}
                >
                  {store === 'all' ? 'All Stores' : store}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search coupon or merchant..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                value={couponSearchQuery}
                onChange={(e) => setCouponSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Coupons grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCoupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="bg-white border border-dashed border-rose-200 hover:border-rose-400 hover:shadow-lg transition-all duration-300 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group"
              >
                {/* Ticket side design */}
                <div className="absolute -left-3 inset-y-0 flex flex-col justify-between py-4 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-50 border-r border-rose-100" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-50 border-r border-rose-100" />
                </div>
                <div className="absolute -right-3 inset-y-0 flex flex-col justify-between py-4 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-50 border-l border-rose-100" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-50 border-l border-rose-100" />
                </div>

                <div className="space-y-2 relative z-10 text-center md:text-left flex-1 min-w-0">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded-full font-mono uppercase tracking-wide">
                      {coupon.store}
                    </span>
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> {coupon.discount}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1">{coupon.description}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-1 text-[10px] text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Expires on {coupon.expiry}</span>
                  </div>
                </div>

                {/* Copy side */}
                <div className="shrink-0 relative z-10 w-full md:w-auto text-center">
                  {copiedCode === coupon.code ? (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
                      <Check className="w-4 h-4 animate-pulse" /> COPIED!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="w-full md:w-auto px-5 py-2.5 bg-slate-900 hover:bg-rose-600 hover:text-white text-rose-100 font-black text-xs font-mono rounded-xl tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300 group-hover:scale-105"
                    >
                      {coupon.code} <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-[9px] text-slate-400 block mt-1.5 font-sans">Click box to copy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Filter and search bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-5">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 bg-white border border-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search advertiser or key terms..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                value={affSearchQuery}
                onChange={(e) => setAffSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Affiliate deals grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAffDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border border-slate-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between gap-5 relative overflow-hidden group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
                      {deal.advertiser}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      <Globe className="w-3 h-3 text-slate-400" /> 
                      {deal.targetedCountries || 'Global'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 text-lg leading-snug group-hover:text-rose-600 transition-colors">
                      {deal.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-2">
                      {deal.description}
                    </p>
                  </div>

                  {deal.threeMonthEpc && deal.threeMonthEpc !== 'N/A' && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-lg w-max font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Avg. EPC Performance: {deal.threeMonthEpc}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2 gap-4">
                  <div>
                    {deal.couponCode ? (
                      <div>
                        {copiedAffCode === deal.couponCode ? (
                          <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-extrabold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 font-mono">
                            <Check className="w-3 h-3 animate-ping" /> COPIED!
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCopyAff(deal.couponCode!)}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                            title="Click to copy coupon code"
                          >
                            CODE: {deal.couponCode} <Copy className="w-3 h-3 text-slate-400" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Direct Promotion Link</span>
                    )}
                  </div>

                  <a
                    href={deal.clickUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-900 hover:bg-rose-600 text-white font-black text-xs font-sans rounded-xl flex items-center gap-1 transition-all group-hover:scale-102 cursor-pointer"
                  >
                    Go to Offer <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}

            {filteredAffDeals.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white border border-slate-100 rounded-3xl text-slate-400 text-sm">
                No advertiser deals matching the query were found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
