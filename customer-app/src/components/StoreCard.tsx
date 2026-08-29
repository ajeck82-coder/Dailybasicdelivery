import React from 'react';
import { Star, Clock, Zap, Bike } from 'lucide-react';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  const isDarkStore = store.category === 'DARK_STORE';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group active:scale-[0.99]"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-200">
        <img
          src={store.coverUrl}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category tag */}
        <div className="absolute top-3 left-3">
          {isDarkStore ? (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full flex items-center shadow-lg uppercase tracking-wider">
              <Zap className="w-3 h-3 mr-1 fill-current" /> 15-Min Delivery
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur text-slate-900 font-bold text-[11px] px-2.5 py-1 rounded-full shadow">
              {store.category.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800">{store.rating}</span>
          <span className="text-[10px] text-slate-400">({store.totalRatings})</span>
        </div>

        {/* ETA & Ward overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-1 font-semibold drop-shadow">
            <Clock className="w-3.5 h-3.5" />
            <span>{store.prepTimeMinutes + 10} - {store.prepTimeMinutes + 20} min</span>
          </div>
          <div className="flex items-center space-x-1 font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur">
            <Bike className="w-3.5 h-3.5 text-orange-400" />
            <span>Bodaboda Direct</span>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-3.5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-orange-600 transition">
              {store.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{store.description}</p>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-600">📍 {store.ward}</span>
          <span>Min: TZS {store.minimumOrderAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
