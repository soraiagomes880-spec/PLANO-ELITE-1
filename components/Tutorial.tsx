
import React from 'react';
import { AppTab } from '../types';

interface TutorialProps {
  setActiveTab: (tab: AppTab) => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ setActiveTab }) => {
  const steps = [
    {
      icon: 'fa-microphone',
      color: 'blue',
      title: 'Chat ao Vivo',
      desc: 'Converse por voz em tempo real. A IA ouve você, transcreve e responde como um nativo. Ideal para quebrar o gelo.',
    },
    {
      icon: 'fa-volume-high',
      color: 'purple',
      title: 'Laboratório de Fala',
      desc: 'Escreva qualquer frase difícil e ouça a pronúncia perfeita. Grave sua voz para receber feedback fonético detalhado.',
    },
    {
      icon: 'fa-pen-nib',
      color: 'pink',
      title: 'Laboratório de Escrita',
      desc: 'Aprimore sua gramática e estilo. Escreva livremente e receba correções inteligentes e sugestões para soar mais natural.',
    },
    {
      icon: 'fa-eye',
      color: 'indigo',
      title: 'Varredura Visual',
      desc: 'Tire uma foto do que está à sua volta. A IA identifica os objetos e ensina como descrevê-los no idioma que você escolheu.',
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-900/40 transform -rotate-6">
          <i className="fas fa-graduation-cap text-white text-2xl"></i>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Como usar o Tutor 360 IA</h2>
        <p className="text-slate-400 text-lg">Seu guia rápido para dominar o aprendizado com inteligência artificial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {steps.map((step, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-[2rem] border-white/10 hover:border-white/20 transition-all flex items-start gap-6 group">
            <div className={`w-16 h-16 rounded-2xl bg-${step.color === 'pink' ? 'rose' : step.color}-500/10 flex items-center justify-center shrink-0 border border-${step.color === 'pink' ? 'rose' : step.color}-500/20 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${step.icon} text-2xl text-${step.color === 'pink' ? 'rose' : step.color}-400`}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 text-center">
        <h4 className="text-indigo-400 font-bold mb-2">Pronto para começar?</h4>
        <p className="text-slate-400 text-sm mb-6">Explore qualquer uma das abas no menu lateral para iniciar sua prática.</p>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
        >
          Entendi, vamos lá!
        </button>
      </div>
    </div>
  );
};
