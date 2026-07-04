import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_TRAVEL_OFFERS, INITIAL_CREDIT_CARDS, INITIAL_BLOG_POSTS, INITIAL_BUYING_GUIDES, INITIAL_AFFILIATE_DEALS
} from './data';
import { Product, Coupon, AlertSubscription, ChatMessage, AffiliateDeal } from './types';
import HomeView from './components/HomeView';
import ProductDetailView from './components/ProductDetailView';
import TravelView from './components/TravelView';
import CreditCardsView from './components/CreditCardsView';
import CouponsView from './components/CouponsView';
import AlertsView from './components/AlertsView';
import BuyingGuidesView from './components/BuyingGuidesView';
import BlogView from './components/BlogView';
import AdminPanelView from './components/AdminPanelView';
import AiAssistantView from './components/AiAssistantView';
import { 
  Sparkles, Tag, Bell, Settings, Heart, MessageSquare, Menu, X, Landmark, Compass, FileText, CheckCircle, ArrowLeftRight
} from 'lucide-react';
import CompareView from './components/CompareView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [affiliateDeals, setAffiliateDeals] = useState<AffiliateDeal[]>(INITIAL_AFFILIATE_DEALS);

  const [alerts, setAlerts] = useState<AlertSubscription[]>([
    { id: 'al-1', email: 'user@test.com', productId: 'lap-01', productName: 'Dell Inspiron 15 3520 Laptop', targetPrice: 53000, createdAt: new Date().toISOString() }
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['lap-02']);
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);
  
  // Selected product detail state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toggle comparison item
  const handleToggleCompare = (productId: string) => {
    setCompareProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          return [...prev.slice(1), productId];
        }
        return [...prev, productId];
      }
    });
  };

  // Clear comparison items
  const handleClearCompare = () => {
    setCompareProductIds([]);
  };

  const handleAddWebProduct = (p: Product) => {
    setProducts(prev => {
      if (prev.some(item => item.id === p.id)) return prev;
      return [p, ...prev];
    });
    setCompareProductIds(prev => {
      if (prev.includes(p.id)) return prev;
      if (prev.length >= 4) {
        return [...prev.slice(1), p.id];
      }
      return [...prev, p.id];
    });
  };

  // Quick Alert modal states
  const [alertTargetProduct, setAlertTargetProduct] = useState<Product | null>(null);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertModalSuccess, setAlertModalSuccess] = useState(false);

  // Chat/AI assistant states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'greeting-1', sender: 'assistant', text: 'Hi! I am your AI Shopping Assistant, powered by Gemini 2.5 Flash on our Node.js server.\n\nAsk me anything! For example:\n- "Compare MacBook Air vs Dell Inspiron 15"\n- "What are the cashback limits on SBI Cashback card?"\n- "Find web hosting discount vouchers"', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Mobile menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Change tab handler
  const handleSetTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedProduct(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select specific product
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }
  };

  // Set alert from cards
  const handleOpenAlertModal = (product: Product) => {
    setAlertTargetProduct(product);
    const minPrice = Math.min(...product.stores.map(s => s.price));
    setAlertTargetPrice(Math.round(minPrice * 0.95).toString());
    setAlertModalSuccess(false);
  };

  const handleSaveAlertModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTargetProduct || !alertEmail || !alertTargetPrice) return;

    const newAlert: AlertSubscription = {
      id: `al-${Date.now()}`,
      email: alertEmail,
      productId: alertTargetProduct.id,
      productName: alertTargetProduct.name,
      targetPrice: Number(alertTargetPrice),
      createdAt: new Date().toISOString()
    };

    setAlerts(prev => [newAlert, ...prev]);
    setAlertModalSuccess(true);
    setTimeout(() => {
      setAlertTargetProduct(null);
      setAlertModalSuccess(false);
    }, 2000);
  };

  // AI Assistant trigger message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          contextProducts: products
        })
      });

      if (!response.ok) {
        throw new Error('AI Assist backend error');
      }

      const data = await response.json();
      const assistMsg: ChatMessage = {
        id: `msg-as-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I processed your query, but my response was empty.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, assistMsg]);
    } catch (err) {
      console.error(err);
      const errMessage: ChatMessage = {
        id: `msg-as-${Date.now()}`,
        sender: 'assistant',
        text: `Error contacting the AI agent. This is usually because the server-side GEMINI_API_KEY is missing or invalid. Please check your **Settings > Secrets** inside AI Studio.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  // Admin action handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const handleAddAffiliateDeal = (newDeal: AffiliateDeal) => {
    setAffiliateDeals(prev => [newDeal, ...prev]);
  };

  const handleDeleteAffiliateDeal = (dealId: string) => {
    setAffiliateDeals(prev => prev.filter(d => d.id !== dealId));
  };


  const handleRemoveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleAddAlertDirect = (alertData: Omit<AlertSubscription, 'id' | 'createdAt'>) => {
    setAlerts(prev => [{
      id: `al-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...alertData
    }, ...prev]);
  };

  const tabsConfig = [
    { id: 'home', label: "Today's Deals", icon: <Tag className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare Products', icon: <ArrowLeftRight className="w-4 h-4 text-indigo-500" /> },
    { id: 'travel', label: 'Travel Offers', icon: <Compass className="w-4 h-4" /> },
    { id: 'cards', label: 'Credit Cards', icon: <Landmark className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons', icon: <Tag className="w-4 h-4 text-rose-500" /> },
    { id: 'alerts', label: 'Deal Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'guides', label: 'Buying Guides', icon: <FileText className="w-4 h-4" /> },
    { id: 'blog', label: 'Blog', icon: <FileText className="w-4 h-4" /> },
    { id: 'chat', label: 'AI Assistant', icon: <MessageSquare className="w-4 h-4 text-indigo-500" />, highlight: true },
    { id: 'admin', label: 'Admin Portal', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div onClick={() => handleSetTab('home')} className="flex items-center gap-2 cursor-pointer group select-none">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-lg font-black tracking-tighter group-hover:bg-indigo-600 transition-colors">
              24
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">TheDeals24</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1 tracking-wide uppercase">Your Smart Shopping Assistant</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                id={tab.id === 'chat' ? 'ai-chat-tab-button' : undefined}
                onClick={() => handleSetTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id && !selectedProduct
                    ? 'bg-slate-900 text-white shadow-sm'
                    : tab.highlight
                    ? 'text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-600 hover:text-slate-950 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-1.5 animate-fadeIn">
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSetTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === tab.id && !selectedProduct
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {selectedProduct ? (
          /* Detailed View overlays standard Tab */
          <ProductDetailView 
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            onOpenAlertModal={handleOpenAlertModal}
            coupons={coupons}
            compareProductIds={compareProductIds}
            onToggleCompare={handleToggleCompare}
          />
        ) : (
          /* Render Tab content */
          <div>
            {activeTab === 'home' && (
              <HomeView 
                products={products}
                onSelectProduct={handleSelectProduct}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
                onOpenAlertModal={handleOpenAlertModal}
                onSetTab={handleSetTab}
                compareProductIds={compareProductIds}
                onToggleCompare={handleToggleCompare}
              />
            )}
            {activeTab === 'compare' && (
              <CompareView 
                products={products}
                compareProductIds={compareProductIds}
                onToggleCompare={handleToggleCompare}
                onClearCompare={handleClearCompare}
                onSetTab={handleSetTab}
                onSendMessage={handleSendMessage}
                onAddWebProduct={handleAddWebProduct}
              />
            )}
            {activeTab === 'travel' && (
              <TravelView offers={INITIAL_TRAVEL_OFFERS} />
            )}
            {activeTab === 'cards' && (
              <CreditCardsView cards={INITIAL_CREDIT_CARDS} />
            )}
            {activeTab === 'coupons' && (
              <CouponsView coupons={coupons} affiliateDeals={affiliateDeals} />
            )}
            {activeTab === 'alerts' && (
              <AlertsView 
                alerts={alerts}
                onAddAlert={handleAddAlertDirect}
                onRemoveAlert={handleRemoveAlert}
                products={products}
              />
            )}
            {activeTab === 'guides' && (
              <BuyingGuidesView guides={INITIAL_BUYING_GUIDES} />
            )}
            {activeTab === 'blog' && (
              <BlogView posts={INITIAL_BLOG_POSTS} />
            )}
            {activeTab === 'chat' && (
              <AiAssistantView 
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                onClearHistory={() => setChatHistory([])}
                loading={chatLoading}
              />
            )}
            {activeTab === 'admin' && (
              <AdminPanelView 
                products={products}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                coupons={coupons}
                onAddCoupon={handleAddCoupon}
                affiliateDeals={affiliateDeals}
                onAddAffiliateDeal={handleAddAffiliateDeal}
                onDeleteAffiliateDeal={handleDeleteAffiliateDeal}
                alerts={alerts}
                onSetTab={handleSetTab}
              />
            )}
          </div>
        )}
      </main>

      {/* Aesthetic Footer explaining utility & Revenue streams */}
      <footer className="bg-slate-900 text-slate-400 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                24
              </div>
              <span className="text-base font-extrabold text-white">TheDeals24</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We empower consumers through live price trackers, objective pros/cons benchmarks, and an interactive Gemini AI Shopping Agent. No biased filters.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Our Revenue Model</h3>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• **Affiliate Link Redirection** - Small commissions at zero cost to you</li>
              <li>• **Premium Brand Sponsorships** - Handpicked hostings or cards</li>
              <li>• **Google AdSense Blocks** - Subtle, un-intrusive page displays</li>
              <li>• **Newsletter Advertisers** - Small sponsor tags inside weekly drops</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Direct Navigation</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => handleSetTab('home')} className="text-left hover:text-white transition-colors cursor-pointer">Catalog Deals</button>
              <button onClick={() => handleSetTab('travel')} className="text-left hover:text-white transition-colors cursor-pointer">Travel Hub</button>
              <button onClick={() => handleSetTab('cards')} className="text-left hover:text-white transition-colors cursor-pointer">Credit Cards</button>
              <button onClick={() => handleSetTab('coupons')} className="text-left hover:text-white transition-colors cursor-pointer">Coupons</button>
              <button onClick={() => handleSetTab('alerts')} className="text-left hover:text-white transition-colors cursor-pointer">Alert Thresholds</button>
              <button onClick={() => handleSetTab('chat')} className="text-left hover:text-white transition-colors cursor-pointer">AI Assistant</button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Security Promise</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              All intelligence layers execute server-side via custom endpoints. Secure tokens are never sent to the client browser. No credit information is stored.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 text-center py-6 text-xs text-slate-500">
          © 2026 TheDeals24 – Your Smart Shopping Assistant. Built with React, Vite, Express, and Google Gemini AI.
        </div>
      </footer>

      {/* Quick alert setup Modal */}
      {alertTargetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 relative shadow-2xl">
            <button 
              onClick={() => setAlertTargetProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase font-mono">
                Price Tracker
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                Track Drop: {alertTargetProduct.name}
              </h3>
              <p className="text-xs text-slate-500">
                Enter your email address and we will monitor all stores (Amazon, Flipkart, etc.). Once any store drops below your target threshold, we will ping you instantly.
              </p>
            </div>

            <form onSubmit={handleSaveAlertModal} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. buyer@gmail.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Trigger Price Threshold (₹)</label>
                <input
                  type="number"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                />
              </div>

              {alertModalSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Threshold Activated Successfully!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Activate Alert Tracker
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Floating Comparison Drawer Indicator */}
      {compareProductIds.length > 0 && activeTab !== 'compare' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-5 border border-slate-800 animate-slideUp">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-indigo-500 rounded-lg text-white flex items-center justify-center">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold font-mono">
              {compareProductIds.length} item{compareProductIds.length > 1 ? 's' : ''} chosen
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSetTab('compare')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow-sm whitespace-nowrap"
            >
              Compare
            </button>
            <button
              onClick={handleClearCompare}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Clear comparison list"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
