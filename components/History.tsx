
import React from 'react';
import { VideoResult } from '../types';

interface HistoryProps {
  history: VideoResult[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">My Studio Gallery</h2>
          <p className="text-slate-400">Review and download your previous cinematic generations.</p>
        </div>
        <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-white/10 text-sm">
          {history.length} Videos Generated
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-panel p-24 rounded-[3rem] border-white/10 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <i className="fas fa-folder-open text-3xl opacity-30"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Start creating to build your collection of high-quality AI animations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((video, idx) => (
            <div key={idx} className="glass-panel rounded-3xl overflow-hidden border-white/10 group hover:border-blue-500/50 transition-all duration-300 flex flex-col">
              <div className={`relative aspect-video bg-black flex items-center justify-center ${video.aspectRatio === '9:16' ? 'aspect-[9/16]' : ''}`}>
                <video src={video.url} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" muted loop onMouseOver={(e) => e.currentTarget.play()} onMouseOut={(e) => e.currentTarget.pause()} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
                    <i className="fas fa-play text-white"></i>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-sm text-slate-300 font-medium mb-4 line-clamp-2 italic">"{video.prompt}"</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded">
                    {video.aspectRatio}
                  </span>
                  <a 
                    href={video.url} 
                    download={`veloce_gen_${idx}.mp4`}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm font-semibold"
                  >
                    <i className="fas fa-download"></i>
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
