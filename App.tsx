
import React, { useState } from 'react';
import { ClientInterface } from './views/ClientInterface';
import { ObserverInterface } from './views/ObserverInterface';
import { Layout, Eye, User, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'client' | 'observer'>('client');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Dynamic Navigation */}
      <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tighter text-white">EPI-SHIELD</span>
          </div>

          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setView('client')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                view === 'client' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Client Portal
            </button>
            <button
              onClick={() => setView('observer')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                view === 'observer' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" /> Observer Node
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Network Secure</span>
          </div>
        </div>
      </nav>

      {/* View Content */}
      <main className="flex-1 overflow-y-auto">
        {view === 'client' ? <ClientInterface /> : <ObserverInterface />}
      </main>

      {/* Footer Info */}
      <footer className="py-6 border-t border-slate-900 text-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
        Decentralized Architecture Protocol v4.0.1 // No-Data-Retention Compliance Active
      </footer>
    </div>
  );
};

export default App;
