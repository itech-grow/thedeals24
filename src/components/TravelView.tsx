import React, { useState } from 'react';
import { TravelOffer } from '../types';
import { 
  Plane, Hotel, Briefcase, FileText, Shield, MapPin, Search, ArrowUpRight, DollarSign, Sparkles, Check, ChevronRight
} from 'lucide-react';

interface TravelViewProps {
  offers: TravelOffer[];
}

export default function TravelView({ offers }: TravelViewProps) {
  const [travelType, setTravelType] = useState<'all' | 'flight' | 'hotel' | 'package' | 'visa' | 'insurance'>('all');
  const [fromCity, setFromCity] = useState('New Delhi (DEL)');
  const [toCity, setToCity] = useState('Singapore (SIN)');
  const [departDate, setDepartDate] = useState('2026-08-15');
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const filteredOffers = travelType === 'all' 
    ? offers 
    : offers.filter(o => o.type === travelType);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSuccess(true);
    setTimeout(() => setSearchSuccess(false), 5000);
  };

  const travelGuides = [
    {
      id: 'dubai',
      title: 'Best time to visit Dubai (Weather & Savings Guide)',
      excerpt: 'Planning to see the Burj Khalifa or go on a desert safari? Read our monthly weather breakdown to grab flights up to 40% cheaper.',
      content: `Dubai is a mesmerizing winter destination. However, prices spike by up to 150% during the peak season. Here is the ultimate insider analysis:

☀️ **Peak Season (November to March)**: Temperatures hover between a perfect 20°C and 30°C. Ideal for beaches and outdoor exploration. Accommodation and flight costs are at their highest. We recommend booking at least 90 days in advance to secure rewards.

🥵 **Off-Peak / Summer Season (June to August)**: Temperatures can soar past 45°C with high humidity. Outdoor activities are limited. However, top-tier 5-star hotels offer incredible 60% discounts, and indoor theme parks (like IMG Worlds of Adventure) are fully air-conditioned.

✨ **The Sweet Spot / Shoulder Season (April, May, September, October)**: This is when you find the best value. Temperatures are warm but manageable (32°C - 38°C). Resorts slash prices, and airlines run massive flash sales. Flights from India can drop to as low as ₹16,000 return.

💡 **Pro-Tip**: Keep an eye out for the Dubai Shopping Festival (typically January). It offers massive electronics discount sales, and hotels often bundle free attraction passes with bookings.`
    },
    {
      id: 'singapore',
      title: 'How to Book Cheap Flights to Singapore from India',
      excerpt: 'Step-by-step hacks for flight routing, budget carrier comparison, and optimal booking windows.',
      content: `Singapore is a primary global hub. While premium airlines charge hefty sums, applying a few tactical travel hacks will keep your costs extremely low:

✈️ **Choose the Right Carrier**:
- **Premium**: Singapore Airlines and Air India offer full service, baggage, and meals.
- **Budget**: Scoot, IndiGo, and AirAsia offer bare-bones fares. If you travel light, booking Scoot can save you up to 45% on the base ticket price.

📅 **Book During the "Goldilocks Window"**:
Flights to Southeast Asia are cheapest **45 to 60 days before departure**. Prices spike exponentially inside the 14-day window.

📆 **The Tuesday Midnight Trick**:
Airlines often announce or load flash deals on Monday nights, and competing carriers match these prices by Tuesday morning/afternoon. Search for flights on Tuesday or Wednesday mid-mornings for lowest rates.

🇸🇬 **Visa & Entry Requirement Quick Check**:
- Tourists need a Singapore paper visa processed through authorized agents (takes 3-5 working days, costs approx. ₹3,000).
- Remember to submit your **SG Arrival Card (SGAC)** online within 3 days before entry—it is entirely free on the official ICA website (do not pay third-party scam sites).`
    }
  ];

  const travelTabs = [
    { id: 'all', label: 'All Offers', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'flight', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
    { id: 'hotel', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> },
    { id: 'package', label: 'Holiday Packages', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'insurance', label: 'Travel Insurance', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Banner / Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-950 p-8 md:p-12 text-white border border-indigo-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-blue-500/25 border border-blue-400/30 text-blue-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">TheDeals24 Travel Hub</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Find Your Next Adventure for Less</h1>
          <p className="text-sm text-indigo-200 font-sans leading-relaxed">
            We scour thousands of deals to bring you verified, hand-picked travel packages, direct flights, luxury hotel discounts, and comprehensive insurances.
          </p>
        </div>
      </div>

      {/* Flight Search Simulator Widget */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plane className="w-5 h-5 text-indigo-600" /> Live Flight Price Comparer
        </h2>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">From</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">To Destination</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Departure Date</label>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-colors"
            >
              <Search className="w-4 h-4" /> Search Lowest Fares
            </button>
          </div>
        </form>

        {searchSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
            <span className="text-xs font-bold text-emerald-800 block">✓ Best price locked for flight route {fromCity} ➔ {toCity}:</span>
            <div className="flex items-center justify-between bg-white border border-slate-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✈️</span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">IndiGo Saver Flight</span>
                  <p className="text-[10px] text-slate-400">Direct • Baggage included • Departing {departDate}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 block">₹18,490</span>
                <span className="text-[10px] text-emerald-600 font-bold">15% cheaper than avg</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        {travelTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTravelType(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              travelType === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Travel Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <div className="w-14 h-14 bg-indigo-50/50 text-indigo-600 text-3xl rounded-xl flex items-center justify-center shrink-0">
              {offer.imageUrl}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold uppercase tracking-wide">{offer.type}</span>
                <span className="font-mono flex items-center gap-0.5"><MapPin className="w-3 h-3 text-indigo-400" /> {offer.destination}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-1">{offer.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{offer.description}</p>
              
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-slate-900 block leading-none">{offer.price}</span>
                  {offer.oldPrice && <span className="text-[10px] text-slate-400 line-through">MSRP {offer.oldPrice}</span>}
                </div>
                <a
                  href={`https://skyscanner.co.in/search?q=${offer.destination}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  Book Deal <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Informative Organic Traffic Guides (SEO Boost) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Expert Travel Planning Guides</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {travelGuides.map((guide) => (
            <div 
              key={guide.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}>
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              {activeGuide === guide.id && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed space-y-3 whitespace-pre-line border-l-2 border-indigo-500">
                  {guide.content}
                </div>
              )}

              <button
                onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
              >
                {activeGuide === guide.id ? 'Collapse Article' : 'Read Full Guide'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
