import React, { useState } from 'react';
import { AlertSubscription, Product } from '../types';
import { Bell, Mail, Target, ArrowDown, Trash2, CheckCircle, Sparkles, Inbox } from 'lucide-react';

interface AlertsViewProps {
  alerts: AlertSubscription[];
  onAddAlert: (alert: Omit<AlertSubscription, 'id' | 'createdAt'>) => void;
  onRemoveAlert: (alertId: string) => void;
  products: Product[];
}

export default function AlertsView({
  alerts,
  onAddAlert,
  onRemoveAlert,
  products
}: AlertsViewProps) {
  const [email, setEmail] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [targetPrice, setTargetPrice] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !targetPrice) return;

    let productName = undefined;
    if (selectedProductId) {
      const match = products.find(p => p.id === selectedProductId);
      if (match) productName = match.name;
    }

    onAddAlert({
      email,
      productId: selectedProductId || undefined,
      category: selectedProductId ? undefined : category,
      productName,
      targetPrice: Number(targetPrice)
    });

    setSuccess(true);
    setTargetPrice('');
    setTimeout(() => setSuccess(false), 5000);
  };

  // Mocked sample drops trigger feed
  const mockDropInbox = [
    { title: 'Dell Inspiron Price Slash', body: 'The Dell Inspiron 15 just dropped to ₹51,990! (Your target alert was set to ₹53,000).', time: '1 hour ago', store: 'Amazon' },
    { title: 'NordVPN Flash Promo', body: 'NordVPN 2-Year Plan is now 80% cheaper (₹3,400 instead of ₹7,200).', time: '5 hours ago', store: 'NordVPN Store' }
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 p-8 md:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Dynamic Pricing</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Instant Deal & Price Drop Alerts</h1>
          <p className="text-sm text-indigo-200 font-sans leading-relaxed">
            Never miss a budget threshold again. Set target prices for specific devices, and get real-time email triggers the instant checkouts go under your budget.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Alert Form (Left) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" /> Create Price Alert
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Your Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Select Product or Category</label>
              <select
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">-- Generic Category-Based --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Now: ₹{Math.min(...p.stores.map(s => s.price)).toLocaleString()})</option>
                ))}
              </select>
            </div>

            {!selectedProductId && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Generic Category</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Mobiles">Mobiles</option>
                  <option value="TVs">TVs</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Software">Software</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Notify When Price Drops Below (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Target className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  required
                  placeholder="e.g., 50000"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Bell className="w-4 h-4" /> Start Tracking Prices
            </button>
          </form>

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-800">Alert configured! We will email you instantly.</span>
            </div>
          )}
        </div>

        {/* Active Subscriptions and Live drop feed (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Subscriptions */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">My Active Alert Rules ({alerts.length})</h2>

            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">You have no active price drop filters configured. Submit the form on the left to activate!</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <div key={alert.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
                        {alert.productName ? 'PRODUCT' : alert.category}
                      </span>
                      <p className="text-xs font-bold text-slate-900">{alert.productName || `Under ${alert.category}`}</p>
                      <span className="text-[10px] text-indigo-600 font-mono font-medium block">
                        Target Threshold: ₹{alert.targetPrice.toLocaleString()} • Email: {alert.email}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveAlert(alert.id)}
                      className="p-2 border border-slate-100 hover:border-slate-200 hover:text-rose-500 text-slate-400 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Triggered mock drops inbox */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Inbox className="w-4 h-4 text-indigo-500" /> Simulated Live Notification Inbox
            </h2>

            <div className="space-y-3">
              {mockDropInbox.map((msg, idx) => (
                <div key={idx} className="border border-slate-50 hover:border-slate-100 bg-slate-50/50 p-4 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 text-lg rounded-lg shrink-0">
                    📉
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold uppercase tracking-wider text-rose-600">{msg.store} Dropped</span>
                      <span className="font-mono">{msg.time}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs">{msg.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-normal">{msg.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
