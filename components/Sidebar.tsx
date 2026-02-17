
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  usage: number;
  limit: number;
  planName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, usage, limit, planName, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início Elite', icon: 'fa-house' },
    { id: 'live', label: 'Tutor de Voz', icon: 'fa-microphone-lines' },
    { id: 'pronunciation', label: 'Pronúncia', icon: 'fa-volume-high' },
    { id: 'writing', label: 'Laboratório Escrita', icon: 'fa-pen-nib' },
    { id: 'scan', label: 'Visão IA', icon: 'fa-eye' },
    { id: 'culture', label: 'Cultura & Real-Time', icon: 'fa-earth-americas' },
    { id: 'tutorial', label: 'Tutorial & Ajuda', icon: 'fa-circle-question' },
  ];

  const usagePercentage = (usage / limit) * 100;
  const isElite = planName === 'Elite';

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 w-72 glass-panel border-r border-white/10 flex flex-col h-full z-40 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6 md:p-8 flex items-center justify-between lg:hidden">
        <h2 className="font-bold text-white uppercase tracking-widest text-xs">Menu Elite</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5">
          <i className="fas fa-times text-slate-400"></i>
        </button>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">DOMÍNIO TOTAL</p>
        <nav className="space-y-1.5 mb-10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group 
                ${activeTab === item.id
                  ? isElite ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow-inner shadow-amber-500/10 lg:bg-amber-500/20 lg:text-amber-300 lg:border-amber-400/30' : 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-inner shadow-indigo-500/10 lg:bg-indigo-500/20 lg:text-indigo-300 lg:border-indigo-400/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white lg:hover:bg-slate-800/40 lg:hover:text-slate-200'
                }`}
            >
              <i className={`fas ${item.icon} text-lg w-6 text-center ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8 border-t border-white/5">
        <div className={`rounded-2xl p-5 border shadow-lg ${isElite ? 'bg-gradient-to-br from-amber-950/50 to-slate-900/50 border-amber-500/20' : 'bg-gradient-to-br from-indigo-950/50 to-slate-900/50 border-white/10'}`}>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isElite ? 'text-amber-300' : 'text-indigo-300'}`}>USO DO PLANO</span>
            <span className="text-xs text-slate-400">{usage}/{limit}</span>
          </div>
          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mb-1">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isElite ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-indigo-500 to-blue-400'}`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Status</span>
            <span className={`text-[9px] font-bold uppercase tracking-tighter ${isElite ? 'text-amber-400' : 'text-indigo-400/80'}`}>{planName}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
