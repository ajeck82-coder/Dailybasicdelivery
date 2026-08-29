import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('+255700000020');
  const [fullName, setFullName] = useState('Neema Mushi');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.requestOtp(phoneNumber);
      if (res.success) {
        setStep('OTP');
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.verifyOtp(phoneNumber, otp, fullName);
      if (res.success && res.token) {
        login(res.token, res.user);
        onClose();
      } else {
        setError(res.message || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Smartphone className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {step === 'PHONE' ? 'Sign In to Dar Delivery' : 'Enter SMS Verification Code'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {step === 'PHONE'
              ? 'Tanzania phone number (+255) for fast order OTP'
              : `Code sent to ${phoneNumber} (Demo code: 123456)`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleRequestOtp} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Neema Mushi"
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Phone Number (+255)</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send OTP Code</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl tracking-widest font-black text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <p className="text-[11px] text-center text-emerald-600 font-semibold mt-1">
                Demo code: <b>123456</b>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Continue</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('PHONE')}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-700"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
