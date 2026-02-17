
import React from 'react';

interface ApiKeyGuardProps {
  onSelect: () => void;
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50 p-6 overflow-y-auto">
      <div className="max-w-2xl w-full">
        <div className="glass-panel p-12 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <i className="fas fa-key text-blue-400 text-4xl"></i>
          </div>

          <h1 className="text-4xl font-bold text-white mb-6">Welcome to Veloce Studio</h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            To use high-quality video generation with <b>Gemini Veo</b>, you must connect a valid API key from a paid Google Cloud project.
          </p>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
              <i className="fas fa-circle-info"></i>
              Requirement
            </h3>
            <p className="text-sm text-slate-300">
              Video generation requires a Google AI Studio account with billing enabled.
              Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-400 underline hover:text-blue-300">ai.google.dev/billing</a> for more details.
            </p>
          </div>

          <button
            onClick={onSelect}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <i className="fas fa-plug-circle-check text-xl"></i>
            Connect My API Key
          </button>
          
          <p className="mt-6 text-xs text-slate-500 italic">
            Your key remains secure and is only used to authorize requests with the Gemini API.
          </p>
        </div>
      </div>
    </div>
  );
};
