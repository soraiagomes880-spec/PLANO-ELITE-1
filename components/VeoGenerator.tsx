
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GenerationStatus, VideoResult } from '../types';
import { withRetry } from '../utils';

interface VeoGeneratorProps {
  onComplete: (video: VideoResult) => void;
}

const REASSURING_MESSAGES = [
  "Iniciando motor neural cinemático...",
  "Analisando texturas e iluminação da imagem...",
  "Sintetizando consistência temporal...",
  "Simulando física e movimento fluido...",
  "Upscaling de frames para qualidade de cinema...",
  "Aplicando desfoque de movimento final...",
  "Otimizando para reprodução...",
];

export const VeoGenerator: React.FC<VeoGeneratorProps> = ({ onComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [status, setStatus] = useState<GenerationStatus>({ step: 'idle', message: '' });
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateVideo = async () => {
    if (!image || !prompt) return;
    setStatus({ step: 'processing', message: REASSURING_MESSAGES[0] });
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % REASSURING_MESSAGES.length;
      setStatus(prev => ({ ...prev, message: REASSURING_MESSAGES[messageIndex] }));
    }, 8000);

    try {
      const base64Data = image.split(',')[1];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Fix: Cast operation to any to access .done and .response properties on the operation object
      let operation: any = await withRetry(() => ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: { imageBytes: base64Data, mimeType: 'image/png' },
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
      }));

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await withRetry(() => ai.operations.getVideosOperation({ operation }));
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Falha ao retornar vídeo.");

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      setResultVideo(videoUrl);
      onComplete({ url: videoUrl, prompt, aspectRatio });
      setStatus({ step: 'complete', message: 'Geração concluída!' });
    } catch (error: any) {
      console.error(error);
      setStatus({ step: 'error', message: error.message || 'Erro ao gerar vídeo.' });
    } finally {
      clearInterval(interval);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2rem] border-white/10 shadow-xl">
          <h2 className="text-xl font-semibold mb-6">Criar Cena Cinemática</h2>
          <div 
            className="relative group border-2 border-dashed rounded-2xl overflow-hidden h-64 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? <img src={image} className="max-w-full max-h-full" /> : <p className="text-slate-500">Upload Frame Inicial</p>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="O que acontece na cena?"
            className="w-full h-32 bg-black/30 border border-white/10 rounded-[2rem] p-6 text-white mt-6 outline-none"
          />
          <button onClick={generateVideo} disabled={!image || !prompt || status.step !== 'idle'} className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl mt-6">
            {status.step === 'idle' ? 'Gerar Vídeo' : 'Processando...'}
          </button>
        </div>
        <div className="glass-panel p-8 rounded-[2.5rem] bg-[#0a0f1d] min-h-[400px] flex items-center justify-center">
          {resultVideo ? <video src={resultVideo} controls loop autoPlay className="max-w-full max-h-full" /> : <p className="text-slate-600">Pré-visualização do vídeo</p>}
          {status.step !== 'idle' && status.step !== 'complete' && <div className="text-indigo-400 animate-pulse">{status.message}</div>}
        </div>
      </div>
    </div>
  );
};
