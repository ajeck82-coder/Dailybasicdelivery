import React, { useState } from 'react';
import { X, Search, Check, MapPin } from 'lucide-react';
import { DAR_WARDS } from '../constants';
import { useAuth } from '../context/AuthContext';

interface WardSelectorModalProps {
  onClose: () => void;
}

export const WardSelectorModal: React.FC<WardSelectorModalProps> = ({ onClose }) => {
  const { selectedWard, setSelectedWard } = useAuth();
  const [search, setSearch] = useState('');

  const filteredWards = DAR_WARDS.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Select Delivery Ward</h2>
              <p className="text-xs text-slate-500">Dar Es Salaam City Zones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ward (e.g. Masaki, Kariakoo, Sinza)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Ward List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-50">
          {filteredWards.map((ward) => {
            const isSelected = selectedWard === ward.name;
            return (
              <button
                key={ward.name}
                onClick={() => {
                  setSelectedWard(ward.name);
                  onClose();
                }}
                className={`w-full p-3 flex items-center justify-between rounded-xl transition ${
                  isSelected ? 'bg-orange-50 text-orange-950 font-bold' : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      isSelected ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    📍
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{ward.name}</div>
                    <div className="text-xs text-slate-400 font-normal">District: {ward.district}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-orange-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
