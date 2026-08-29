import React from 'react';
import { User, Phone, LogOut, MapPin, Shield, HelpCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onOpenAuth: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenAuth }) => {
  const { user, selectedWard, logout } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Sign in to your Account</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Access saved addresses, favorites, and live delivery updates in Dar Es Salaam.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-sm shadow-md transition"
        >
          Sign In with Phone (+255)
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 p-4 max-w-md mx-auto space-y-4">
      {/* Profile Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-xl flex items-center justify-center shadow-md">
          {user.fullName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">{user.fullName}</h2>
          <div className="flex items-center text-xs text-slate-500 mt-0.5">
            <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>{user.phoneNumber}</span>
          </div>
          <span className="inline-block mt-2 text-[10px] font-bold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
            Dar Es Salaam Customer
          </span>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden text-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-slate-700">
            <MapPin className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-semibold text-slate-900">Current Delivery Ward</div>
              <div className="text-xs text-slate-400">{selectedWard}, Dar Es Salaam</div>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-slate-700">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="font-semibold text-slate-900">Payment Security</div>
              <div className="text-xs text-slate-400">Mobile Money Carrier Verified</div>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-slate-700">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-slate-900">Dar Customer Support</div>
              <div className="text-xs text-slate-400">WhatsApp & Phone Hotline</div>
            </div>
          </div>
          <span className="text-xs font-bold text-orange-600">+255 700 000 000</span>
        </div>
      </div>

      {/* Switch Portal Links (Convenience for testing) */}
      <div className="p-4 bg-slate-100 rounded-2xl text-xs space-y-2 text-slate-600">
        <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Developer & Staff Portals:</div>
        <div className="flex flex-wrap gap-2">
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold hover:text-orange-600 flex items-center space-x-1"
          >
            <span>Driver App (3001)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold hover:text-orange-600 flex items-center space-x-1"
          >
            <span>Partner Portal (3002)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="http://localhost:3003"
            target="_blank"
            rel="noreferrer"
            className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold hover:text-orange-600 flex items-center space-x-1"
          >
            <span>Admin Dashboard (3003)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
