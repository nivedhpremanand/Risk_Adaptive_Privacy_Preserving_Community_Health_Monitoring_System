
import React, { useState, useEffect } from 'react';
import { CohortSnapshot, SymptomCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
// Added Activity to the imports to resolve 'Cannot find name Activity' error
import { ShieldCheck, Database, Users, Fingerprint, Calendar, Info, RefreshCw, Activity } from 'lucide-react';

export const ObserverInterface: React.FC = () => {
  const [snapshots, setSnapshots] = useState<CohortSnapshot[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<CohortSnapshot | null>(null);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('cohort_snapshots');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSnapshots(parsed);
        if (parsed.length > 0) setSelectedCohort(parsed[0]);
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = selectedCohort 
    ? Object.entries(selectedCohort.aggregateScores).map(([name, value]) => ({ name, value }))
    : [];

  const timelineData = snapshots.map(s => ({
    time: new Date(s.timestamp).toLocaleTimeString(),
    // Added explicit typing for reduce parameters to resolve unknown arithmetic operation error
    intensity: Object.values(s.aggregateScores).reduce((a: number, b: number) => a + b, 0) / 5
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
            <Database className="w-5 h-5" />
            <span>Community Health Ledger</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Observer Analytics Node</h1>
          <p className="text-slate-500">Authorized viewing of finalized cohort snapshots.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Cohorts</p>
              <p className="text-2xl font-bold">{snapshots.length}</p>
            </div>
          </div>
          <div className="glass p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Privacy Engine</p>
              <p className="text-2xl font-bold">Active</p>
            </div>
          </div>
        </div>
      </header>

      {snapshots.length === 0 ? (
        <div className="glass border border-slate-800 rounded-3xl p-20 text-center">
          <RefreshCw className="w-12 h-12 text-slate-600 mx-auto mb-6 animate-spin" />
          <h2 className="text-xl font-bold text-slate-400">Waiting for cohorts to seal...</h2>
          <p className="text-slate-600 mt-2">Minimum population threshold: 5 users per cohort.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass border border-slate-800 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Symptom Intensity Distribution
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg">
                  <Fingerprint className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-mono text-slate-500 truncate max-w-[150px]">
                    {selectedCohort?.zkpProof}
                  </span>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 1]}
                    />
                    <Tooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-4">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-sm text-slate-400 leading-relaxed">
                  <strong>Statistical Consistency Check:</strong> Values include risk-adaptive Differential Privacy noise (ε={selectedCohort?.privacyEpsilon}).
                  This prevents individual inference while maintaining signal for community health patterns.
                </p>
              </div>
            </div>

            <div className="glass border border-slate-800 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Community Anomaly Timeline
              </h2>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 1]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                    <Area type="monotone" dataKey="intensity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIntensity)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar: Cohort Selection */}
          <div className="space-y-6">
            <div className="glass border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4">Sealed Cohorts</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {snapshots.slice().reverse().map((cohort) => (
                  <button
                    key={cohort.id}
                    onClick={() => setSelectedCohort(cohort)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedCohort?.id === cohort.id 
                      ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-slate-500 uppercase">Snapshot {cohort.id.split('-')[1]}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-bold text-white">Size: {cohort.size} Contributors</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      {new Date(cohort.timestamp).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass border border-amber-500/20 rounded-3xl p-6 bg-amber-500/5">
              <h3 className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-tighter">ZKP Verification</h3>
              <p className="text-xs text-slate-400 mb-4">
                Each snapshot is accompanied by a Zero-Knowledge Proof confirming:
              </p>
              <ul className="text-[10px] space-y-2 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full"></div> Population n ≥ 5</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full"></div> Differential Privacy ε Applied</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full"></div> Fragment Integrity Intact</li>
              </ul>
              <div className="mt-4 p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[8px] text-amber-500/70 break-all">
                {selectedCohort?.zkpProof}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
