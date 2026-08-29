import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface MomoPaymentModalProps {
  orderId: string;
  orderNumber: string;
  amount: number;
  providerName: string;
  phoneNumber: string;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

export const MomoPaymentModal: React.FC<MomoPaymentModalProps> = ({
  orderId,
  orderNumber,
  amount,
  providerName,
  phoneNumber,
  onPaymentSuccess,
  onClose,
}) => {
  const [status, setStatus] = useState<'PROMPTED' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('PROMPTED');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulatePinApproval = async () => {
    setStatus('PROCESSING');
    try {
      const res = await api.simulateMomoApproval(orderId);
      if (res.success || res.status === 'SUCCESS') {
        setStatus('SUCCESS');
        setTimeout(() => {
          onPaymentSuccess();
        }, 1200);
      } else {
        setStatus('FAILED');
      }
    } catch (err) {
      console.error(err);
      setStatus('FAILED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 text-center animate-scale-up">
        {status === 'PROMPTED' && (
          <>
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Smartphone className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">USSD Push Prompt Sent</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please check your phone (<span className="font-bold text-slate-800">{phoneNumber}</span>) for the{' '}
              <span className="font-bold text-orange-600">{providerName}</span> PIN prompt.
            </p>

            {/* USSD Dialog Mock Card */}
            <div className="my-5 p-3.5 bg-slate-900 text-white rounded-2xl text-left font-mono text-xs shadow-inner">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">USSD Flash Screen:</div>
              <p className="text-emerald-400 font-semibold">
                Lipa kwa {providerName}?{'\n'}
                Kiasi: TZS {amount.toLocaleString()}{'\n'}
                Kumbukumbu: {orderNumber}
              </p>
              <div className="mt-2 text-slate-300 text-[11px] flex justify-between">
                <span>Weka PIN kuthibitisha</span>
                <span className="text-orange-400 font-bold">{countdown}s</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSimulatePinApproval}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>Simulate Entering PIN (Demo)</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
              >
                Cancel Payment
              </button>
            </div>
          </>
        )}

        {status === 'PROCESSING' && (
          <div className="py-8">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Verifying Transaction...</h3>
            <p className="text-xs text-slate-500 mt-1">Connecting to {providerName} carrier gateway</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="py-6">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3 animate-scale-up" />
            <h3 className="text-lg font-extrabold text-slate-900">Payment Successful!</h3>
            <p className="text-xs text-slate-500 mt-1">
              TZS {amount.toLocaleString()} received via {providerName}.
            </p>
            <p className="text-[11px] text-orange-600 font-semibold mt-2">Sending order to restaurant kitchen...</p>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="py-6">
            <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900">Payment Failed</h3>
            <p className="text-xs text-slate-500 mt-1">The mobile money carrier declined or timed out.</p>
            <button
              onClick={() => setStatus('PROMPTED')}
              className="mt-4 px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
