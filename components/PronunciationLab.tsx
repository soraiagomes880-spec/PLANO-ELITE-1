
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';
import { Language, LANGUAGES } from '../types';
import { withRetry } from '../utils';
import { getGeminiKey } from '../lib/gemini';

interface PronunciationLabProps {
  language: Language;
  onAction?: () => void;
}

const DEFAULT_PHRASES: Record<Language, string> = {
  'Inglês': 'Through the thickest fog, the three friends thought they heard thunder.',
  'Espanhol': 'Tres tristes tigres tragaban trigo en un trigal.',
  'Francês': 'Un chasseur sachant chasser sans son chien est un bon chasseur.',
  'Alemão': 'Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz.',
  'Português Brasil': 'O rato roeu a roupa do rei de Roma e a rainha raivosa rasgou o resto.',
  'Japonês': '生麦生米生卵 (Namamugi namamigome namatamago).',
  'Italiano': 'Trentatré trentini entrarono a Trento todos e trentatré trotterellando.',
  'Chinês': '妈妈骑马。马慢，妈妈骂马。(Māma qí mǎ. Mǎ màn, māma mà mǎ.)'
};

export const PronunciationLab: React.FC<PronunciationLabProps> = ({ language, onAction }) => {
  const [targetPhrase, setTargetPhrase] = useState(DEFAULT_PHRASES[language]);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetTransLang, setTargetTransLang] = useState<Language>('Português Brasil');

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setTargetPhrase(DEFAULT_PHRASES[language]);
    setFeedback(null);
  }, [language]);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const playTargetAudio = async () => {
    if (isPlayingTarget || !targetPhrase.trim()) return;
    setIsPlayingTarget(true);
    try {
      const apiKey = getGeminiKey();
      if (!apiKey) {
        alert("API Key não configurada. Clique no título do app (5 vezes) para configurar sua chave e tente novamente.");
        setIsPlayingTarget(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      // Fix: Use GenerateContentResponse generic type for withRetry to resolve "unknown" type error
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say this clearly in ${language}: ${targetPhrase}` }] }],
        config: {
          // Fix: Correct typo in responseModalities (was responseModalalities)
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      }));

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlayingTarget(false);
        source.start();
      } else { setIsPlayingTarget(false); }
    } catch (e) { setIsPlayingTarget(false); }
  };

  const handleAnalyze = async () => {
    setIsRecording(false);
    if (!targetPhrase.trim()) {
      setFeedback("Por favor, escreva algo para treinar.");
      return;
    }
    setFeedback("Analisando sua pronúncia...");
    setTranslation(null);
    if (onAction) onAction();

    try {
      const apiKey = getGeminiKey();
      if (!apiKey) {
        alert("API Key não configurada. Clique no título do app (5 vezes) para configurar sua chave e tente novamente.");
        setFeedback(null);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      // Fix: Use GenerateContentResponse generic type for withRetry to resolve "unknown" type error
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the pronunciation of this phrase in ${language} for a student: "${targetPhrase}". Assume the student just spoke this. Provide 3 specific tips on how to pronounce specific sounds or words in this text clearly. Respond in Portuguese.`,
      }));
      setFeedback(response.text ?? null);
    } catch (e: any) {
      setFeedback(e.message?.includes('503')
        ? "O servidor de IA está sobrecarregado. Tente novamente em instantes."
        : "Erro ao analisar. Tente novamente.");
    }
  };

  const translateFeedback = async () => {
    if (!feedback || isTranslating) return;
    setIsTranslating(true);
    try {
      const apiKey = getGeminiKey();
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate this pronunciation feedback into ${targetTransLang}: "${feedback}"`,
      }));
      setTranslation(response.text ?? null);
    } catch (e) {
      setTranslation("Erro na tradução.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Laboratório de Pronúncia</h2>
        <p className="text-slate-400">Personalize seu treino escrevendo exatamente o que deseja praticar em {language}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-xl space-y-8 flex flex-col">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">O que você quer treinar?</label>
              <button onClick={() => setTargetPhrase('')} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Limpar Texto</button>
            </div>
            <textarea
              value={targetPhrase}
              onChange={(e) => setTargetPhrase(e.target.value)}
              placeholder={`Escreva uma palavra ou frase em ${language} aqui...`}
              className="w-full bg-black/30 p-6 rounded-2xl border border-white/10 text-xl font-medium text-white leading-relaxed focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none h-40"
            />
            <div className="flex justify-end">
              <button onClick={playTargetAudio} disabled={isPlayingTarget || !targetPhrase.trim()} className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-30 transition-colors uppercase tracking-widest">
                <i className={`fas ${isPlayingTarget ? 'fa-spinner fa-spin' : 'fa-volume-high'}`}></i>
                {isPlayingTarget ? 'Reproduzindo...' : 'Ouvir Pronúncia da IA'}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 py-4 flex-1 justify-center">
            <button
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={handleAnalyze}
              disabled={!targetPhrase.trim()}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 group relative disabled:opacity-20 ${isRecording ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-90' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-900/40 hover:scale-105'}`}
            >
              <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-4xl text-white`}></i>
              {isRecording && <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>}
            </button>
            <p className={`font-black text-sm transition-all uppercase tracking-widest ${isRecording ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
              {isRecording ? 'Capturando sua voz...' : 'Segure para Gravar sua fala'}
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-xl flex flex-col min-h-[500px]">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Feedback Fonético Personalizado</label>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {feedback ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4 text-green-400 mb-6 bg-green-400/10 p-5 rounded-2xl border border-green-400/20">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"><i className="fas fa-spell-check"></i></div>
                  <div>
                    <p className="font-bold">Análise do Tutor IA</p>
                    <p className="text-[10px] uppercase opacity-80 tracking-tighter">Foco na clareza e entonação</p>
                  </div>
                </div>
                <div className="prose prose-invert text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5 italic">
                  {feedback}
                </div>

                {translation && (
                  <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in">
                    <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap italic">{translation}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={targetTransLang}
                      onChange={(e) => setTargetTransLang(e.target.value as Language)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-slate-300 outline-none"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.name} value={lang.name} className="bg-slate-900">{lang.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={translateFeedback}
                      disabled={isTranslating}
                      className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      {isTranslating ? <i className="fas fa-spinner fa-spin"></i> : "Traduzir"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 italic p-12 text-center">
                <i className="fas fa-keyboard text-3xl opacity-10 mb-6"></i>
                <p className="max-w-[200px] text-sm leading-relaxed">Digite qualquer palavra or frase e receba dicas instantâneas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }`}</style>
    </div>
  );
};
