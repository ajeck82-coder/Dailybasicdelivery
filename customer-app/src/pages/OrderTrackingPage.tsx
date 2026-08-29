import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, CheckCircle, Clock, ChefHat, Bike, Home, Navigation, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { api, getCustomerSocket } from '../services/api';

interface OrderTrackingPageProps {
  orderId: string;
  onBack: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId, onBack }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();

    // Listen to real-time status updates via Socket.IO
    const socket = getCustomerSocket();
    socket.emit('join_order_room', orderId);

    socket.on('order_status_changed', (data: any) => {
      console.log('⚡ Live Order update received:', data);
      if (data.order) {
        setOrder(data.order);
      } else {
        loadOrder();
      }
    });

    socket.on('payment_confirmed', () => {
      loadOrder();
    });

    return () => {
      socket.off('order_status_changed');
      socket.off('payment_confirmed');
    };
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await api.getOrderById(orderId);
      if (res.success) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="p-6 text-center max-w-md mx-auto min-h-screen flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-orange-600 animate-spin mb-3" />
        <h3 className="font-bold text-slate-800">Loading Order Tracking...</h3>
      </div>
    );
  }

  // Determine active step index
  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received & Confirmed', icon: CheckCircle },
    { key: 'ACCEPTED_BY_STORE', label: 'Preparing', desc: 'Kitchen is cooking', icon: ChefHat },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Bodaboda arriving', icon: Clock },
    { key: 'PICKED_UP', label: 'On The Way', desc: 'Driver en route to you', icon: Bike },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your meal!', icon: Home },
  ];

  const getStepStatus = (stepKey: string) => {
    const orderHierarchy = [
      'PENDING_PAYMENT',
      'PLACED',
      'ACCEPTED_BY_STORE',
      'PREPARING',
      'READY_FOR_PICKUP',
      'DRIVER_ASSIGNED',
      'AT_STORE',
      'PICKED_UP',
      'IN_TRANSIT',
      'DELIVERED',
    ];

    const currentIndex = orderHierarchy.indexOf(order.status);
    const targetIndex = orderHierarchy.indexOf(stepKey);

    if (order.status === 'DELIVERED') return 'completed';
    if (currentIndex >= targetIndex) return 'completed';
    if (currentIndex === targetIndex - 1) return 'active';
    return 'pending';
  };

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-sm">Order #{order.orderNumber}</h1>
            <p className="text-[11px] text-orange-600 font-semibold">{order.storeName}</p>
          </div>
        </div>

        <button
          onClick={loadOrder}
          className="p-2 text-slate-400 hover:text-slate-700 transition"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Simulated Live Dar Es Salaam Map Card */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 relative h-52">
          {/* Stylized vector map pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Route path graphic */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 60 140 Q 180 80 320 60"
              fill="none"
              stroke="#ea580c"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Store Pin */}
          <div className="absolute left-10 bottom-8 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg border-2 border-orange-500 text-xs font-bold">
              🏬
            </div>
            <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded-full mt-1">
              {order.storeWard}
            </span>
          </div>

          {/* Live Driver Bodaboda Marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xl shadow-orange-500/50 border-2 border-white">
              <Bike className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-orange-200 font-extrabold bg-slate-950/80 px-2 py-0.5 rounded-full mt-1">
              {order.driverName ? `${order.driverName} (Bodaboda)` : 'Finding Driver...'}
            </span>
          </div>

          {/* Customer Destination Pin */}
          <div className="absolute right-8 top-8 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
              📍
            </div>
            <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded-full mt-1">
              {order.deliveryWard}
            </span>
          </div>

          {/* Map Status Badge */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1.5 border border-white/10">
            <Navigation className="w-3.5 h-3.5 text-orange-400 animate-spin" />
            <span>
              {order.status === 'DELIVERED'
                ? 'Order Delivered'
                : order.status === 'IN_TRANSIT' || order.status === 'PICKED_UP'
                ? 'Bodaboda En Route (10 mins)'
                : 'Order in Progress'}
            </span>
          </div>
        </div>

        {/* Driver Card if Assigned */}
        {order.driverName && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base">
                🛵
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{order.driverName}</h4>
                <div className="text-xs text-slate-500">
                  <span>{order.driverVehicle || 'Bodaboda'} Driver</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${order.driverPhone}`}
              className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow hover:bg-emerald-200 transition"
              title="Call Driver"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Step Progress Stepper */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Delivery Status Timeline</h3>

          <div className="space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const status = getStepStatus(step.key);
              const isCompleted = status === 'completed';
              const isActive = status === 'active';

              return (
                <div key={step.key} className="flex items-start space-x-3.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'bg-orange-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted ? 'text-slate-900' : isActive ? 'text-orange-600' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCompleted && <span className="text-[10px] text-emerald-600 font-bold">Done</span>}
                      {isActive && <span className="text-[10px] text-orange-600 font-bold">In progress</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 text-sm mb-2">Order Items</h4>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-slate-700">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold">TZS {item.itemTotal.toLocaleString()}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
            <span>Total Paid ({order.paymentMethod})</span>
            <span className="text-orange-600">TZS {(order.subtotal + order.deliveryFee).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
