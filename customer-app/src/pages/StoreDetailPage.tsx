import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Plus, Check } from 'lucide-react';
import { Store, MenuItem } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

interface StoreDetailPageProps {
  storeId: string;
  onBack: () => void;
}

export const StoreDetailPage: React.FC<StoreDetailPageProps> = ({ storeId, onBack }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const { addToCart, items } = useCart();

  useEffect(() => {
    loadStore();
  }, [storeId]);

  const loadStore = async () => {
    try {
      setLoading(true);
      const res = await api.getStoreById(storeId);
      if (res.success) {
        setStore(res.store);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !store) {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-3/4" />
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Get distinct menu categories
  const categories = ['ALL', ...Array.from(new Set(store.menuItems.map((m) => m.category)))];

  const filteredItems = store.menuItems.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  return (
    <div className="pb-28">
      {/* Cover Header */}
      <div className="relative h-56 w-full bg-slate-900">
        <img src={store.coverUrl} alt={store.name} className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-800 shadow-md hover:bg-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center space-x-2">
            <span className="bg-orange-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
              {store.category.replace('_', ' ')}
            </span>
            <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{store.rating} ({store.totalRatings})</span>
            </div>
          </div>
          <h1 className="text-xl font-black mt-1 leading-tight drop-shadow">{store.name}</h1>
          <div className="flex items-center space-x-3 text-xs text-slate-200 mt-1">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-orange-400" />
              {store.ward} - {store.street}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-orange-400" />
              {store.prepTimeMinutes} mins
            </span>
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-slate-100 px-4 py-2.5 overflow-x-auto flex space-x-2 no-scrollbar shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items List */}
      <div className="p-4 space-y-3">
        {filteredItems.map((item) => {
          const cartItem = items.find((i) => i.menuItemId === item.id);
          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between space-x-3"
            >
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                <div className="mt-2 font-extrabold text-sm text-slate-900">
                  TZS {item.price.toLocaleString()}
                </div>
              </div>

              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => addToCart(item, store)}
                  className={`absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition ${
                    cartItem ? 'bg-emerald-600 text-white' : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                  title="Add to cart"
                >
                  {cartItem ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
