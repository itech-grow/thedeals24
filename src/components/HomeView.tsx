import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Sparkles, TrendingUp, Tag, Heart, Bell, Star, ArrowUpRight, Flame, ArrowLeftRight } from 'lucide-react';
import ProductImage from './ProductImage';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  onOpenAlertModal: (product: Product) => void;
  onSetTab: (tab: string) => void;
  compareProductIds: string[];
  onToggleCompare: (productId: string) => void;
}

export default function HomeView({
  products,
  onSelectProduct,
  onToggleWishlist,
  wishlist,
  onOpenAlertModal,
  onSetTab,
  compareProductIds = [],
  onToggleCompare
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'electronics' | 'fashion' | 'grocery' | 'software'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = filteredProducts.filter(p => p.featured);
  const todayDeals = filteredProducts.filter(p => p.todayDeal);
  const priceDrops = filteredProducts.filter(p => p.priceDropToday);

  // Helper to get lowest price
  const getMinPrice = (product: Product) => {
    return Math.min(...product.stores.map(s => s.price));
  };

  const getMinOldPrice = (product: Product) => {
    const minStore = product.stores.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
    return minStore.oldPrice;
  };

  const getSavePercent = (product: Product) => {
    const minStore = product.stores.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
    const save = minStore.oldPrice - minStore.price;
    return Math.round((save / minStore.oldPrice) * 100);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 5000);
    }
  };

  const categoryCards = [
    { id: 'electronics', label: 'Electronics', icon: '💻', count: products.filter(p => p.category === 'electronics').length },
    { id: 'fashion', label: 'Fashion', icon: '👗', count: products.filter(p => p.category === 'fashion').length },
    { id: 'grocery', label: 'Grocery', icon: '🥜', count: products.filter(p => p.category === 'grocery').length },
    { id: 'software', label: 'Software', icon: '🌐', count: products.filter(p => p.category === 'software').length },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section / Search Bar */}
      <div className="relative rounded-3xl overflow-hidden bg-radial from-slate-900 to-slate-950 text-white p-8 md:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 px-4 py-1.5 rounded-full text-xs text-indigo-300 font-medium tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Empowered by Server-Side AI Price Comparison
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Smart Shopping, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Zero Effort</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-sans leading-relaxed">
            Compare live prices across Amazon, Flipkart, Croma, and more. Get coupons, price drop history, and instant deal alerts.
          </p>

          {/* Large Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search products, brands, categories (e.g. Dell Inspiron, OnePlus, Laptops...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-300 shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="text-xs text-slate-500">Popular searches:</span>
            {['Dell Inspiron', 'MacBook Air', 'S24 Ultra', 'NordVPN'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => setSearchQuery(keyword)}
                className="text-xs font-sans font-medium px-3 py-1 rounded-full bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 hover:border-slate-600 transition-colors cursor-pointer text-slate-300"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Explore Top Categories</h2>
          <button onClick={() => onSetTab('coupons')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            See Coupons <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryCards.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`p-6 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer ${
                selectedCategory === cat.id
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-md shadow-indigo-100/50'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'
              }`}
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <h3 className="font-semibold text-slate-900">{cat.label}</h3>
              <p className="text-xs text-slate-400 mt-1">{cat.count} verified deals</p>
              <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Deals ({products.length})
        </button>
        {categoryCards.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Today's Best Deals section */}
      {todayDeals.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-rose-500 pl-3">
            <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Today's Best Hot Deals</h2>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-2">Limited Hours</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayDeals.map((product) => {
              const minPrice = getMinPrice(product);
              const minOldPrice = getMinOldPrice(product);
              const savePercent = getSavePercent(product);
              const isSaved = wishlist.includes(product.id);

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Save badge */}
                  <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-bounce">
                    <Flame className="w-3.5 h-3.5" />
                    -{savePercent}% OFF
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-2.5 rounded-full shadow-md border backdrop-blur-md transition-all duration-300 ${
                        isSaved 
                          ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600' 
                          : 'bg-white/90 text-slate-600 border-slate-100 hover:bg-white hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => onToggleCompare(product.id)}
                      className={`p-2.5 rounded-full shadow-md border backdrop-blur-md transition-all duration-300 ${
                        compareProductIds.includes(product.id)
                          ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                          : 'bg-white/90 text-slate-600 border-slate-100 hover:bg-white hover:text-indigo-600'
                      }`}
                      title={compareProductIds.includes(product.id) ? "Remove from comparison" : "Add to comparison"}
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenAlertModal(product)}
                      className="p-2.5 rounded-full bg-white/90 text-slate-600 hover:text-indigo-600 hover:bg-white border border-slate-100 shadow-md backdrop-blur-md transition-all duration-300"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product visual box */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative cursor-pointer overflow-hidden p-4"
                  >
                    <div className="w-full h-32 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <ProductImage 
                        imageSrc={product.image} 
                        category={product.category} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        emojiClassName="text-6xl select-none"
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {product.brand}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span>{product.subcategory}</span>
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-current" /> {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                      
                      <h3 
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer text-base"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-50">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-slate-900">₹{minPrice.toLocaleString()}</span>
                          <span className="text-xs line-through text-slate-400">₹{minOldPrice.toLocaleString()}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          Best price from {product.stores.reduce((prev, curr) => prev.price < curr.price ? prev : curr).name}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                      >
                        Compare {product.stores.length} Stores <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Price Drops Today / Recent additions split section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Today's Price Drops */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Top Price Drops Today</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {priceDrops.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No price drops recorded today. Search for items or check back later!</div>
            ) : (
              priceDrops.map((product) => {
                const minPrice = getMinPrice(product);
                const minOldPrice = getMinOldPrice(product);
                const dropAmount = minOldPrice - minPrice;
                const savePercent = getSavePercent(product);

                return (
                  <div 
                    key={product.id}
                    className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => onSelectProduct(product)}
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center p-1.5 transform group-hover:scale-105 transition-transform duration-300 shrink-0 overflow-hidden">
                      <ProductImage 
                        imageSrc={product.image} 
                        category={product.category} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        emojiClassName="text-3xl select-none"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">{product.brand}</span>
                        <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> Save ₹{dropAmount.toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors mt-0.5">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-extrabold text-slate-900">₹{minPrice.toLocaleString()}</span>
                        <span className="text-xs line-through text-slate-400">₹{minOldPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
                        -{savePercent}%
                      </div>
                      <button
                        onClick={() => onToggleCompare(product.id)}
                        className={`text-[10px] font-bold block mt-1.5 ml-auto cursor-pointer transition-colors ${
                          compareProductIds.includes(product.id)
                            ? 'text-indigo-600 hover:text-indigo-700'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {compareProductIds.includes(product.id) ? '✓ Compared' : '+ Compare'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Col: Featured Brands & Newsletter */}
        <section className="flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Featured Brands</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Apple', icon: '🍏', desc: 'Premium Laptops' },
                { name: 'Dell', icon: '💻', desc: 'Workhorse Gear' },
                { name: 'Samsung', icon: '📱', desc: 'Stellar Displays' },
                { name: 'OnePlus', icon: '🚀', desc: 'Speed & Charging' },
                { name: 'Hostinger', icon: '🌐', desc: 'Affordable Web' },
                { name: 'NordVPN', icon: '🛡️', desc: 'Ultimate Privacy' }
              ].map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => setSearchQuery(brand.name)}
                  className="p-4 bg-white border border-slate-100 rounded-2xl text-center hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-2xl block mb-1.5 group-hover:scale-110 transition-transform">{brand.icon}</span>
                  <span className="text-xs font-bold text-slate-800 block">{brand.name}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{brand.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Panel */}
          <div className="bg-radial from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" /> Join TheDeals24 Newsletter
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Get hand-curated weekly alerts for massive coupon drops, error fares, premium software sales, and cashbacks. Zero spam.
              </p>
              
              {newsletterSubscribed ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-center">
                  <span className="text-sm font-semibold text-emerald-400">🎉 Success! You are subscribed to instant alerts.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email for deals..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Featured / Trending Products Grid */}
      {featuredProducts.length > todayDeals.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Trending & Featured Products</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const minPrice = getMinPrice(product);
              const minOldPrice = getMinOldPrice(product);
              const isSaved = wishlist.includes(product.id);

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Heart and bell actions */}
                  <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-2 rounded-full shadow-md border backdrop-blur-md transition-all duration-300 ${
                        isSaved 
                          ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600' 
                          : 'bg-white/90 text-slate-600 border-slate-100 hover:bg-white hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => onToggleCompare(product.id)}
                      className={`p-2 rounded-full shadow-md border backdrop-blur-md transition-all duration-300 ${
                        compareProductIds.includes(product.id)
                          ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                          : 'bg-white/90 text-slate-600 border-slate-100 hover:bg-white hover:text-indigo-600'
                      }`}
                      title={compareProductIds.includes(product.id) ? "Remove from comparison" : "Add to comparison"}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenAlertModal(product)}
                      className="p-2 rounded-full bg-white/90 text-slate-600 hover:text-indigo-600 hover:bg-white border border-slate-100 shadow-md backdrop-blur-md transition-all duration-300"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Image box */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="h-40 bg-slate-50 flex items-center justify-center relative cursor-pointer p-4 overflow-hidden"
                  >
                    <div className="w-full h-24 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                      <ProductImage 
                        imageSrc={product.image} 
                        category={product.category} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        emojiClassName="text-5xl select-none"
                      />
                    </div>
                    <span className="absolute top-3 left-3 bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Featured</span>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{product.brand} • {product.subcategory}</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                          <Star className="w-3 h-3 fill-current" /> {product.rating}
                        </span>
                      </div>
                      <h3 
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-extrabold text-slate-900">₹{minPrice.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{minOldPrice.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-850 cursor-pointer transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
