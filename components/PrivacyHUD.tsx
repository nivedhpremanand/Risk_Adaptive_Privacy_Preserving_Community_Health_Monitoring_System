
import React from 'react';
import { Shield, Lock, Cpu, Globe } from 'lucide-react';

interface PrivacyHUDProps {
  status: 'Idle' | 'Processing' | 'Fragmenting' | 'Transmitting' | 'Complete';
}

export const PrivacyHUD: React.FC<PrivacyHUDProps> = ({ status }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl glass border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-2xl z-50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${status === 'Complete' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Privacy Status</p>
          <p className="text-sm font-bold text-white tracking-wide">{status}</p>
        </div>
      </div>
      
      <div className="hidden md:flex gap-6 items-center border-l border-slate-700 pl-6">
        <div className="text-center">
          <p className="text-[10px] uppercase text-slate-500 mb-1">Local Processing</p>
          <Cpu className="w-4 h-4 mx-auto text-emerald-500" />
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-slate-500 mb-1">Encrypted Grains</p>
          <Lock className="w-4 h-4 mx-auto text-emerald-500" />
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-slate-500 mb-1">Geo-Fuzzy</p>
          <Globe className="w-4 h-4 mx-auto text-emerald-500" />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500 pulse-privacy"></div>
        <span className="text-xs font-mono text-emerald-500">AES-256 Enabled</span>
      </div>
    </div>
  );
};
