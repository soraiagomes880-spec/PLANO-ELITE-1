
export const getGeminiKey = () => {
    // 1. Ordem de prioridade para a chave
    // 1a. Local Storage (Configuração Secreta do Usuário)
    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey && localKey.length > 10) return localKey;

    // 1b. Environment Variables (Vite/Vercel)
    const viteKey = import.meta.env.VITE_API_KEY;
    if (viteKey && viteKey.length > 10) return viteKey;

    // 1c. Fallback Legacy
    const processKey = (process.env as any).API_KEY;
    if (processKey && processKey.length > 10) return processKey;

    return null;
};
