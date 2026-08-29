import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { isCartOpen, setIsCartOpen, items, currentStore, updateQuantity, removeFromCart, clearCart, subtotal } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Order Cart</h2>
              {currentStore && <p className="text-xs text-orange-600 font-semibold">{currentStore.name}</p>}
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Your cart is empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Explore restaurants & dark stores in Dar Es Salaam to add delicious food or essentials.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-6 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition"
            >
              Start Browsing
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.menuItemId} className="py-3 flex items-center justify-between">
                  <div className="flex-1 pr-3">
                    <div className="font-bold text-slate-900 text-sm leading-tight">{item.name}</div>
                    <div className="text-xs font-semibold text-orange-600 mt-0.5">
                      TZS {item.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2 bg-slate-100 px-2 py-1 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 shadow-sm"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="ml-3 text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Summary & Checkout */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">TZS {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Delivery Fee</span>
                  <span className="font-medium">Calculated at Checkout</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onCheckout();
                  }}
                  className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
