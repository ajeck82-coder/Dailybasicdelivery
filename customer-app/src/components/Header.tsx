import React, { useState } from 'react';
import { MapPin, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { WardSelectorModal } from './WardSelectorModal';

interface HeaderProps {
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onNavigate }) => {
  const { user, selectedWard } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [isWardModalOpen, setIsWardModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 px-4 py-3 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Location / Ward Selector */}
          <button
            onClick={() => setIsWardModalOpen(true)}
            className="flex items-center space-x-2 text-left group"
          >
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Delivering to (Dar)
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center">
                {selectedWard}, Dar Es Salaam
                <span className="ml-1 text-xs text-orange-600">▼</span>
              </div>
            </div>
          </button>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-orange-600 transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => (user ? onNavigate('profile') : onOpenAuth())}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
            >
              {user ? (
                <div className="text-xs font-bold text-orange-600">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isWardModalOpen && <WardSelectorModal onClose={() => setIsWardModalOpen(false)} />}
    </>
  );
};
