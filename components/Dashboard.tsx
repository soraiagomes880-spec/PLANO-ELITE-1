
import React from 'react';
import { Language, AppTab } from '../types';

interface DashboardProps {
  language: Language;
  setActiveTab: (tab: AppTab) => void;
  usage: number;
  limit: number;
  planName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ language, setActiveTab, usage, limit, planName }) => {
  const usagePercentage = Math.round((usage / limit) * 100);
  const strokeDashoffset = 502 - (502 * usagePercentage) / 100;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Praticar {language}</h2>
          <p className="text-slate-400 text-base md:text-lg">Foco de hoje: <span className="text-amber-400 font-semibold">Domínio Total (ELITE)</span></p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">Plano {planName} Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-panel p-6 rounded-3xl border-white/10 flex flex-col items-center text-center border-amber-500/5 bg-amber-500/5">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 mb-4">
            <i className="fas fa-check-double text-xl"></i>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Ações Realizadas</p>
          <h3 className="text-xl md:text-2xl font-bold text-white">{usage}</h3>
        </div>
        <div className="glass-panel p-6 rounded-3xl border-white/10 flex flex-col items-center text-center border-amber-500/5 bg-amber-500/5">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 mb-4">
            <i className="fas fa-infinity text-xl"></i>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Capacidade Elite</p>
          <h3 className="text-xl md:text-2xl font-bold text-white">{limit}</h3>
        </div>
        <div className="glass-panel p-6 rounded-3xl border-white/10 flex flex-col items-center text-center border-amber-500/5 bg-amber-500/5">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-4">
            <i className="fas fa-globe text-xl"></i>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Inteligência</p>
          <h3 className="text-xl md:text-2xl font-bold text-white">Google Search</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-amber-900/10 to-transparent">
          <div className="relative z-10 flex flex-col items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full border-8 border-amber-500/20 flex items-center justify-center relative shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-amber-500" strokeDasharray="502" strokeDashoffset={strokeDashoffset} style={{ r: '38%' }} />
              </svg>
              <div className="text-center">
                  <span className="text-2xl font-black text-white">{usagePercentage}%</span>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Uso</p>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Seu Progresso Elite</h3>
              <p className="text-slate-400 text-sm mb-4 italic">Você tem acesso total a todos os recursos de IA.</p>
              <button onClick={() => setActiveTab('live')} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-900/40">Conversar com Tutor Elite</button>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border-amber-500/10 bg-slate-900/40 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 mb-4 border border-amber-500/20">
            <i className="fas fa-shield-halved text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Status da Conta: Ativo</h3>
          <p className="text-slate-400 text-xs max-w-xs">Todas as ferramentas de transcrição, tradução e busca em tempo real estão desbloqueadas para sua conta.</p>
        </div>
      </div>
    </div>
  );
};
