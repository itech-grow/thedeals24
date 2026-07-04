import React, { useState } from 'react';
import { CreditCardOffer } from '../types';
import { CreditCard, Shield, Star, DollarSign, Check, ChevronRight, Sparkles } from 'lucide-react';

interface CreditCardsViewProps {
  cards: CreditCardOffer[];
}

export default function CreditCardsView({ cards }: CreditCardsViewProps) {
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [appliedCardId, setAppliedCardId] = useState<string | null>(null);

  const filteredCards = selectedBank === 'all' 
    ? cards 
    : cards.filter(c => c.bank === selectedBank);

  const handleApply = (id: string) => {
    setAppliedCardId(id);
    setTimeout(() => setAppliedCardId(null), 4000);
  };

  const banksList = ['all', ...Array.from(new Set(cards.map(c => c.bank)))];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-emerald-950 p-8 md:p-12 text-white border border-emerald-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Rewards Maximizer</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Best Shopping Credit Cards compared</h1>
          <p className="text-sm text-emerald-200 font-sans leading-relaxed">
            Don't leave free money on the table. Double-dip on all online sales using cards that offer up to 5% flat cashback with no brand locks.
          </p>
        </div>
      </div>

      {/* Bank Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
        <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold mr-2">Bank filter:</span>
        {banksList.map((bank) => (
          <button
            key={bank}
            onClick={() => setSelectedBank(bank)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedBank === bank
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-100'
                : 'text-slate-600 hover:bg-slate-50 border border-slate-100 bg-white'
            }`}
          >
            {bank === 'all' ? 'All Banks' : bank}
          </button>
        ))}
      </div>

      {/* Cards Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div 
            key={card.id} 
            className="bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Top design panel */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-3xl font-bold font-sans text-slate-200/60 pointer-events-none uppercase">
                {card.bank.split(' ')[0]}
              </div>

              <div className="space-y-4 relative z-10">
                <div className="w-12 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-md border border-amber-300/50 shadow-sm relative overflow-hidden flex items-center justify-center">
                  <span className="text-xs">💳</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block font-bold">{card.bank}</span>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">{card.cardName}</h3>
                </div>
              </div>
            </div>

            {/* Benefits & pricing list */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs font-bold text-center">
                  🔥 Special Offer: {card.offer}
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">Key Rewards & Perks</span>
                  {card.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Annual Fee:</span>
                  <span className="font-extrabold text-slate-900">{card.annualFee}</span>
                </div>

                {appliedCardId === card.id ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl text-center">
                    <span className="text-xs font-bold text-emerald-400">🎉 Pre-Approved! Redirecting to secure form...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(card.id)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    Apply Now & Claim Bonus <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards double-dip education panel */}
      <section className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" /> How to "Double-Dip" on TheDeals24 Shopping
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-2xl">
          Smart shoppers never pay full MSRP. Double-dipping means combining store discount deals with promo voucher codes, and completing the purchase with a high-reward cashback credit card. For example, buying a phone on Amazon discounted from ₹30k to ₹25k, copying a ₹500 store coupon code, and paying with the SBI Card gets you another ₹1,200 cashback. Total price: ₹23,300 instead of ₹30,000!
        </p>
      </section>
    </div>
  );
}
