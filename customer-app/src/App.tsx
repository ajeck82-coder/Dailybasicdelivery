import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ProfilePage } from './pages/ProfilePage';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCheckoutView, setIsCheckoutView] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Navigation handlers
  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId);
  };

  const handleBackToExplore = () => {
    setSelectedStoreId(null);
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutView(true);
  };

  const handleOrderCreated = (orderId: string) => {
    setIsCheckoutView(false);
    setSelectedStoreId(null);
    setSelectedOrderId(orderId);
    setCurrentTab('orders');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        {/* Render Top Header when in exploration */}
        {!selectedStoreId && !isCheckoutView && !selectedOrderId && (
          <Header
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigate={(view) => setCurrentTab(view)}
          />
        )}

        {/* View Routing */}
        <main className="flex-1">
          {selectedOrderId ? (
            <OrderTrackingPage
              orderId={selectedOrderId}
              onBack={() => setSelectedOrderId(null)}
            />
          ) : isCheckoutView ? (
            <CheckoutPage
              onBack={() => setIsCheckoutView(false)}
              onOrderCreated={handleOrderCreated}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          ) : selectedStoreId ? (
            <StoreDetailPage
              storeId={selectedStoreId}
              onBack={handleBackToExplore}
            />
          ) : currentTab === 'home' ? (
            <HomePage onSelectStore={handleSelectStore} />
          ) : currentTab === 'darkstore' ? (
            <HomePage onSelectStore={handleSelectStore} onSelectCategory={() => {}} />
          ) : currentTab === 'orders' ? (
            <OrderHistoryPage
              onSelectOrder={(id) => setSelectedOrderId(id)}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          ) : currentTab === 'profile' ? (
            <ProfilePage onOpenAuth={() => setIsAuthModalOpen(true)} />
          ) : null}
        </main>

        {/* Bottom Cart Drawer */}
        <CartDrawer onCheckout={handleProceedToCheckout} />

        {/* Bottom Navigation */}
        {!isCheckoutView && !selectedOrderId && (
          <BottomNav currentTab={currentTab} onSelectTab={(tab) => {
            setSelectedStoreId(null);
            setCurrentTab(tab);
          }} />
        )}

        {/* Auth Modal */}
        {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
