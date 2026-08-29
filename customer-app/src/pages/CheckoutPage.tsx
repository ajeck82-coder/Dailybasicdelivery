import React, { useState } from 'react';
import { ArrowLeft, MapPin, Smartphone, ShieldCheck, Bike, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MOMO_PROVIDERS, DAR_WARDS } from '../constants';
import { api } from '../services/api';
import { MomoPaymentModal } from '../components/MomoPaymentModal';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderCreated: (orderId: string) => void;
  onOpenAuth: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderCreated, onOpenAuth }) => {
  const { items, currentStore, subtotal, clearCart } = useCart();
  const { user, token, selectedWard } = useAuth();

  const [street, setStreet] = useState('Plot 24, Mwai Kibaki Road');
  const [building, setBuilding] = useState('Apartment 4B');
  const [landmark, setLandmark] = useState('Near Total Petrol Station');
  const [specialNotes, setSpecialNotes] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('MPESA');
  const [phone, setPhone] = useState(user?.phoneNumber || '+255712345678');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Momo Payment modal state
  const [activeMomoOrder, setActiveMomoOrder] = useState<{
    orderId: string;
    orderNumber: string;
    amount: number;
    provider: string;
  } | null>(null);

  // Delivery fee estimation based on Dar ward
  const deliveryFee = 3500;
  const totalAmount = subtotal + deliveryFee;

  const currentWardData = DAR_WARDS.find((w) => w.name === selectedWard) || DAR_WARDS[0];

  const handlePlaceOrder = async () => {
    if (!user || !token) {
      onOpenAuth();
      return;
    }

    if (!currentStore) return;

    try {
      setIsSubmitting(true);
      const payload = {
        storeId: currentStore.id,
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        deliveryWard: selectedWard,
        deliveryStreet: street,
        deliveryBuilding: building,
        deliveryLandmark: landmark,
        deliveryLat: currentWardData.lat,
        deliveryLng: currentWardData.lng,
        paymentMethod: selectedProvider,
        specialNotes,
      };

      const res = await api.createOrder(payload, token);
      if (res.success && res.order) {
        const order = res.order;

        if (selectedProvider === 'CASH_ON_DELIVERY') {
          clearCart();
          onOrderCreated(order.id);
        } else {
          // Trigger Mobile Money STK Push
          await api.initiateMomoPush(order.id, phone, selectedProvider, token);
          setActiveMomoOrder({
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: totalAmount,
            provider: MOMO_PROVIDERS.find((p) => p.id === selectedProvider)?.name || selectedProvider,
          });
        }
      } else {
        alert(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-32 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center space-x-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-slate-900 text-base">Checkout & Payment</h1>
          <p className="text-xs text-slate-500">Order from {currentStore?.name}</p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Delivery Address Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>Delivery Destination in Dar</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Ward / Area</label>
            <input
              type="text"
              readOnly
              value={`${selectedWard}, Dar Es Salaam`}
              className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Street / Road</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Haile Selassie Road"
              className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-500">House / Apt</label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Apt 2B"
                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Nearest Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Opposite Church"
                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-orange-600" />
              <span>Mobile Money & Payment</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Tanzania MNOs
            </span>
          </div>

          <div className="space-y-2">
            {MOMO_PROVIDERS.map((provider) => {
              const isSelected = selectedProvider === provider.id;
              return (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: isSelected ? '#ea580c' : '#cbd5e1' }}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{provider.name}</div>
                      <div className="text-[11px] text-slate-500">{provider.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {provider.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedProvider !== 'CASH_ON_DELIVERY' && (
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-600">Mobile Money Phone (+255)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">A secure USSD PIN prompt will appear automatically.</p>
            </div>
          )}
        </div>

        {/* Order Summary & Pricing */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 text-sm mb-2">Order Price Summary</h4>
          <div className="flex justify-between text-slate-600">
            <span>Items Subtotal ({items.length} items)</span>
            <span className="font-semibold text-slate-900">TZS {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="flex items-center">
              <Bike className="w-3.5 h-3.5 mr-1 text-orange-500" />
              Bodaboda Delivery ({currentStore?.ward} → {selectedWard})
            </span>
            <span className="font-semibold text-slate-900">TZS {deliveryFee.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Payable</span>
            <span className="text-orange-600">TZS {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between space-x-3">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Amount</div>
            <div className="text-lg font-black text-slate-900">TZS {totalAmount.toLocaleString()}</div>
          </div>
          <button
            disabled={isSubmitting}
            onClick={handlePlaceOrder}
            className="flex-1 py-3.5 px-6 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Place Order & Pay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Momo Payment Modal */}
      {activeMomoOrder && (
        <MomoPaymentModal
          orderId={activeMomoOrder.orderId}
          orderNumber={activeMomoOrder.orderNumber}
          amount={activeMomoOrder.amount}
          providerName={activeMomoOrder.provider}
          phoneNumber={phone}
          onPaymentSuccess={() => {
            clearCart();
            onOrderCreated(activeMomoOrder.orderId);
            setActiveMomoOrder(null);
          }}
          onClose={() => setActiveMomoOrder(null)}
        />
      )}
    </div>
  );
};
