
export type AppTab = 'dashboard' | 'live' | 'pronunciation' | 'writing' | 'scan' | 'culture' | 'tutorial';

export type Language = 'Inglês' | 'Espanhol' | 'Francês' | 'Alemão' | 'Português Brasil' | 'Japonês' | 'Italiano' | 'Chinês';

// Add missing types used by VeoGenerator and History components
export type AspectRatio = '16:9' | '9:16';

export interface GenerationStatus {
  step: 'idle' | 'processing' | 'complete' | 'error';
  message: string;
}

export interface VideoResult {
  url: string;
  prompt: string;
  aspectRatio: AspectRatio;
}

export interface LanguageOption {
  name: Language;
  code: string;
  flag: string;
  region: string;
}

export const LANGUAGES: LanguageOption[] = [
  { name: 'Inglês', code: 'en', flag: '🇺🇸', region: 'USA/UK' },
  { name: 'Espanhol', code: 'es', flag: '🇪🇸', region: 'Spain/LATAM' },
  { name: 'Francês', code: 'fr', flag: '🇫🇷', region: 'France' },
  { name: 'Alemão', code: 'de', flag: '🇩🇪', region: 'Germany' },
  { name: 'Português Brasil', code: 'pt-br', flag: '🇧🇷', region: 'Brasil' },
  { name: 'Japonês', code: 'ja', flag: '🇯🇵', region: 'Japão' },
  { name: 'Italiano', code: 'it', flag: '🇮🇹', region: 'Itália' },
  { name: 'Chinês', code: 'zh', flag: '🇨🇳', region: 'China' },
];

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}