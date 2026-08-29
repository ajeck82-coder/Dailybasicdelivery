import React, { useState, useEffect } from 'react';
import { Search, Flame, Zap, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { StoreCard } from '../components/StoreCard';
import { Store } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onSelectStore: (storeId: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectStore }) => {
  const { selectedWard } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, [selectedWard, category, search]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const res = await api.getStores(selectedWard, category, search);
      if (res.success) {
        setStores(res.stores);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-2">
      {/* Promo Banner / Dar Es Salaam Theme */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-5 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur mb-2">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Dar Fast Delivery</span>
            </div>
            <h2 className="text-xl font-extrabold leading-tight">Chakula & Vyakula Haraka</h2>
            <p className="text-xs text-orange-100 mt-1 max-w-xs">
              Direct from top restaurants & dark stores in <span className="underline font-bold">{selectedWard}</span>.
            </p>
          </div>
          <div className="absolute right-2 -bottom-2 text-7xl opacity-20 select-none">🛵</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search Nyama Choma, Mishikaki, Grocery, Store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="mb-6 overflow-x-auto px-4 flex space-x-2.5 no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
                isSelected
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Stores Section Header */}
      <div className="px-4 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1.5">
          <Flame className="w-5 h-5 text-orange-600" />
          <h3 className="font-extrabold text-slate-900 text-base">Popular in {selectedWard}</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">{stores.length} open</span>
      </div>

      {/* Stores List */}
      <div className="px-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-48 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
            <div className="text-4xl mb-2">🏝️</div>
            <h4 className="font-bold text-slate-800 text-base">No stores found in {selectedWard}</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try switching your delivery ward to <b>Masaki</b>, <b>Kariakoo</b>, or <b>Mikocheni</b>.
            </p>
          </div>
        ) : (
          stores.map((store) => (
            <StoreCard key={store.id} store={store} onClick={() => onSelectStore(store.id)} />
          ))
        )}
      </div>

      {/* Trust Badges footer */}
      <div className="mt-8 px-4 py-4 bg-orange-50/50 rounded-2xl mx-4 border border-orange-100 flex items-center justify-between text-slate-600 text-xs">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Mobile Money Secured (M-Pesa / Tigo)</span>
        </div>
      </div>
    </div>
  );
};
