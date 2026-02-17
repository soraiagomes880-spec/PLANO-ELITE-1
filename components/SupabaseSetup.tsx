
import React, { useState } from 'react';
import { saveSupabaseConfig } from '../lib/supabase';

interface SupabaseSetupProps {
  onClose: () => void;
}

export const SupabaseSetup: React.FC<SupabaseSetupProps> = ({ onClose }) => {
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('supabase_key') || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && key) {
      saveSupabaseConfig(url, key);
    } else {
      alert("Por favor, preencha a URL e a Anon Key.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="max-w-md w-full glass-panel p-8 rounded-[2.5rem] border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <i className="fas fa-database text-indigo-400"></i>
            Configurar Supabase
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><i className="fas fa-times"></i></button>
        </div>

        <p className="text-slate-400 text-xs mb-6 leading-relaxed">
          Para salvar o progresso dos alunos, pegue essas informações no painel do seu projeto no Supabase em <b>Project Settings &gt; API</b>.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Project URL</label>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyz.supabase.co"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Anon / Public Key</label>
            <input 
              type="password" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbG..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-900/40 transition-all mt-4"
          >
            Conectar e Salvar
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-[10px] text-amber-500 leading-tight">
            <b>Nota:</b> Certifique-se de que a tabela <code>profiles</code> foi criada no seu Supabase.
          </p>
        </div>
      </div>
    </div>
  );
};
