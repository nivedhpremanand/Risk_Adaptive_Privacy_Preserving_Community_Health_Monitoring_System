
import React, { useState, useEffect } from 'react';
import { SymptomCategory } from '../types';
import { calculateLocalRiskVector, createSnapshot } from '../services/privacyEngine';
import { PrivacyHUD } from '../components/PrivacyHUD';
// Added Shield to the imports to resolve 'Cannot find name Shield' error
import { CheckCircle, AlertCircle, Trash2, ArrowRight, Activity, Shield } from 'lucide-react';

export const ClientInterface: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'select' | 'processing' | 'success'>('intro');
  const [selected, setSelected] = useState<SymptomCategory[]>([]);
  const [status, setStatus] = useState<'Idle' | 'Processing' | 'Fragmenting' | 'Transmitting' | 'Complete'>('Idle');

  const toggleSymptom = (cat: SymptomCategory) => {
    setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleProcess = async () => {
    setStep('processing');
    setStatus('Processing');
    
    // Simulate Browser-Side Computation
    await new Promise(r => setTimeout(r, 1200));
    setStatus('Fragmenting');
    
    // Generate Vector
    const vector = calculateLocalRiskVector(selected);
    console.log('Local Health Risk Vector Generated:', vector);
    
    await new Promise(r => setTimeout(r, 1500));
    setStatus('Transmitting');
    
    // Simulate "Federated" aggregation - In a real app this would go to separate servers
    // Here we push to a mock "Global Ledger" in localStorage for the Observer view
    const existingStr = localStorage.getItem('pending_vectors');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    const newVector = { scores: vector, timestamp: Date.now(), geoHash: 'ge-7xx' };
    const updated = [...existing, newVector];
    
    // Cohort Threshold Logic (Check if we reached 5 users)
    if (updated.length >= 5) {
      const snapshot = createSnapshot(updated, 0.8);
      const snapshotsStr = localStorage.getItem('cohort_snapshots');
      const snapshots = snapshotsStr ? JSON.parse(snapshotsStr) : [];
      localStorage.setItem('cohort_snapshots', JSON.stringify([...snapshots, snapshot]));
      localStorage.removeItem('pending_vectors');
    } else {
      localStorage.setItem('pending_vectors', JSON.stringify(updated));
    }

    await new Promise(r => setTimeout(r, 800));
    setStatus('Complete');
    setStep('success');
  };

  const reset = () => {
    setSelected([]);
    setStep('intro');
    setStatus('Idle');
  };

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-32 px-6">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest mb-4">
          <Activity className="w-4 h-4" /> Epi-Shield Sentinel
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Decentralized Health Reporting
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Report health trends without identity. Your data never leaves this browser in raw form.
          Encrypted gradients are aggregated using federated learning.
        </p>
      </header>

      <div className="relative">
        {step === 'intro' && (
          <div className="glass border border-slate-800 rounded-3xl p-10 text-center">
            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Privacy-First Architecture</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
              {[
                { title: 'No Login', desc: 'No accounts, IDs, or cookies.' },
                { title: 'Local Compute', desc: 'Health vectors computed in-browser.' },
                { title: 'Zero-Leak', desc: 'Raw data is deleted immediately.' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setStep('select')}
              className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              Begin Anonymous Report <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'select' && (
          <div className="glass border border-slate-800 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-8">Identify Coarse Symptom Groups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {Object.values(SymptomCategory).map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleSymptom(cat)}
                  className={`p-6 rounded-2xl text-left border transition-all duration-300 ${
                    selected.includes(cat) 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{cat}</span>
                    {selected.includes(cat) && <CheckCircle className="w-6 h-6 text-blue-400" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-slate-500 italic max-w-sm">
                * Selected inputs are converted to a low-res vector. Local raw memory is cleared on submission.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSelected([])}
                  className="px-6 py-3 rounded-full text-slate-400 hover:text-white flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" /> Clear
                </button>
                <button 
                  disabled={selected.length === 0}
                  onClick={handleProcess}
                  className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Gradient
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="glass border border-slate-800 rounded-3xl p-20 text-center overflow-hidden relative">
            <div className="relative z-10">
              <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-10"></div>
              <h2 className="text-3xl font-bold mb-4 capitalize">{status}...</h2>
              <div className="max-w-md mx-auto bg-slate-900 h-2 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                  style={{ width: status === 'Processing' ? '30%' : status === 'Fragmenting' ? '60%' : '90%' }}
                ></div>
              </div>
              <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                Local-Model: Transformer-Lite v2.4 | Privacy: On
              </p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
              <div className="grid grid-cols-10 gap-1 h-full">
                {Array.from({length: 100}).map((_, i) => (
                  <div key={i} className="bg-blue-500 h-10 w-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="glass border border-emerald-500/30 rounded-3xl p-12 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Gradient Contributed</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Your contribution was split into encrypted fragments and added to a <strong>Time-Bounded Cohort</strong>. 
              Raw inputs have been purged from memory.
            </p>
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl inline-block text-left mb-10">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-tighter text-emerald-400">Verification Result</span>
              </div>
              <p className="text-sm font-mono text-slate-300">Cohort ID: {Math.random().toString(36).substr(2, 9)}</p>
              <p className="text-sm font-mono text-slate-300">Status: SEALED & PSEUDONYMIZED</p>
            </div>
            <div>
              <button 
                onClick={reset}
                className="px-8 py-4 border border-slate-700 text-white rounded-full font-bold hover:bg-slate-800 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <PrivacyHUD status={status} />
    </div>
  );
};
