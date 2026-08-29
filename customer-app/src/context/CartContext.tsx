import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Store } from '../types';

interface CartContextType {
  items: CartItem[];
  currentStore: { id: string; name: string; ward: string } | null;
  addToCart: (item: MenuItem, store: Store) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dar_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentStore, setCurrentStore] = useState<{ id: string; name: string; ward: string } | null>(() => {
    const saved = localStorage.getItem('dar_cart_store');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dar_cart_items', JSON.stringify(items));
    localStorage.setItem('dar_cart_store', JSON.stringify(currentStore));
  }, [items, currentStore]);

  const addToCart = (item: MenuItem, store: Store) => {
    // If cart has items from another store, prompt or reset
    if (currentStore && currentStore.id !== store.id && items.length > 0) {
      if (confirm(`You have items from ${currentStore.name}. Clear cart and add from ${store.name}?`)) {
        setItems([
          {
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            storeId: store.id,
            storeName: store.name,
            imageUrl: item.imageUrl,
          },
        ]);
        setCurrentStore({ id: store.id, name: store.name, ward: store.ward });
        setIsCartOpen(true);
      }
      return;
    }

    setCurrentStore({ id: store.id, name: store.name, ward: store.ward });

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) => (i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          storeId: store.id,
          storeName: store.name,
          imageUrl: item.imageUrl,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i)));
  };

  const removeFromCart = (menuItemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.menuItemId !== menuItemId);
      if (updated.length === 0) {
        setCurrentStore(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setCurrentStore(null);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        currentStore,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
