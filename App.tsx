
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LiveChat } from './components/LiveChat';
import { PronunciationLab } from './components/PronunciationLab';
import { GrammarLab } from './components/GrammarLab';
import { VisualScan } from './components/VisualScan';
import { CultureHub } from './components/CultureHub';
import { Tutorial } from './components/Tutorial';
import { Auth } from './components/Auth';
import { AppTab, Language, LANGUAGES } from './types';
import { supabase } from './lib/supabase';
import { SupabaseSetup } from './components/SupabaseSetup';

export type PlanLevel = 'Essencial' | 'Pro' | 'Elite';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [language, setLanguage] = useState<Language>('Inglês');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [plan, setPlan] = useState<PlanLevel>('Elite');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const planLimits: Record<PlanLevel, number> = {
    'Essencial': 50,
    'Pro': 80,
    'Elite': 100
  };

  const usageLimit = planLimits[plan];

  useEffect(() => {
    if (!supabase) {
      setIsLoadingData(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);

      if (supabase && session?.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('usage_count, plan_level')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setUsageCount(data.usage_count || 0);
            // Forçamos Elite para este deploy
            setPlan('Elite');
          } else if (error && error.code === 'PGRST116') {
            await supabase.from('profiles').insert([
              { id: session.user.id, usage_count: 0, plan_level: 'Elite' }
            ]);
            setUsageCount(0);
            setPlan('Elite');
          }
        } catch (e) {
          console.error("Erro na sincronização:", e);
        }
      } else {
        const localUsage = localStorage.getItem('tutor_usage');
        setUsageCount(localUsage ? parseInt(localUsage) : 0);
      }

      setIsLoadingData(false);
    };

    loadData();
  }, [session]);

  const trackUsage = async () => {
    const nextCount = usageCount + 1;
    if (nextCount > usageLimit) return;

    setUsageCount(nextCount);

    if (supabase && session?.user) {
      await supabase
        .from('profiles')
        .update({ usage_count: nextCount })
        .eq('id', session.user.id);
    } else {
      localStorage.setItem('tutor_usage', nextCount.toString());
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    else {
      setSession(null);
      setUsageCount(0);
    }
  };

  if (supabase && !session) {
    return <Auth />;
  }

  if (isLoadingData) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">Ativando Plano ELITE...</p>
        </div>
      </div>
    );
  }

  const currentLang = LANGUAGES.find(l => l.name === language) || LANGUAGES[0];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden relative">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
        usage={usageCount}
        limit={usageLimit}
        planName={plan}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-20 glass-panel border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10"
            >
              <i className="fas fa-bars text-white"></i>
            </button>
            <div
              className="hidden xs:flex w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg items-center justify-center shadow-lg shadow-amber-500/20 cursor-pointer"
              onClick={() => {
                const next = clickCount + 1;
                if (next >= 5) {
                  setShowConfig(true);
                  setClickCount(0);
                } else {
                  setClickCount(next);
                  setTimeout(() => setClickCount(0), 3000);
                }
              }}
            >
              <i className="fas fa-crown text-white text-xl"></i>
            </div>
            <div>
              <h1
                className="text-lg md:text-xl font-bold tracking-tight text-white leading-none cursor-pointer"
                onClick={() => {
                  const next = clickCount + 1;
                  if (next >= 5) {
                    setShowConfig(true);
                    setClickCount(0);
                  } else {
                    setClickCount(next);
                    setTimeout(() => setClickCount(0), 3000);
                  }
                }}
              >
                Tutor 360 <span className="text-amber-400">IA</span>
              </h1>
              <span className="text-[8px] md:text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 font-black uppercase mt-1 inline-block tracking-widest">{plan}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
                <span className="text-lg">{currentLang.flag}</span>
                <i className={`fas fa-chevron-down text-[10px] text-slate-500 transition-transform ${showLangMenu ? 'rotate-180' : ''}`}></i>
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-panel rounded-2xl border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.name} onClick={() => { setLanguage(lang.name); setShowLangMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-300 transition-colors">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95"
              title="Sair"
            >
              <i className="fas fa-right-from-bracket"></i>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard language={language} setActiveTab={setActiveTab} usage={usageCount} limit={usageLimit} planName={plan} />}
          {activeTab === 'live' && <LiveChat language={language} onAction={trackUsage} />}
          {activeTab === 'pronunciation' && <PronunciationLab language={language} onAction={trackUsage} />}
          {activeTab === 'writing' && <GrammarLab language={language} onAction={trackUsage} />}
          {activeTab === 'scan' && <VisualScan language={language} onAction={trackUsage} />}
          {activeTab === 'culture' && <CultureHub language={language} onAction={trackUsage} />}
          {activeTab === 'tutorial' && <Tutorial setActiveTab={setActiveTab} />}
        </div>
        {showConfig && <SupabaseSetup onClose={() => setShowConfig(false)} />}
      </main>
    </div>
  );
};

export default App;
