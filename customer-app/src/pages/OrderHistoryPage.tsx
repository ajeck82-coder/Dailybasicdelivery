import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface OrderHistoryPageProps {
  onSelectOrder: (orderId: string) => void;
  onOpenAuth: () => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onSelectOrder, onOpenAuth }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getMyOrders(token!);
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return (
      <div className="p-6 text-center max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">View your Order History</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6 max-w-xs">
          Sign in with your Tanzanian phone number to track your active orders and receipts.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-sm shadow-md transition"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 p-4 max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">My Orders</h2>
        <span className="text-xs text-slate-400 font-medium">{orders.length} total orders</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No orders yet</h4>
          <p className="text-xs text-slate-500 mt-1">Your past deliveries will show up here.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order.id)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{order.storeName}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  #{order.orderNumber} • {order.deliveryWard}
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {order.items?.length || 1} items ({order.paymentMethod})
              </span>
              <span className="font-extrabold text-slate-900">
                TZS {(order.subtotal + order.deliveryFee).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
