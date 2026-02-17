-- TABELA DE PERFIS (profiles) - Versão ELITE
-- Esta tabela armazena o uso e o nível do plano de cada aluno.

-- 1. Criação da Tabela
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  usage_count INTEGER DEFAULT 0,
  plan_level TEXT DEFAULT 'Elite',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilita Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE SEGURANÇA (RLS)

-- Permite que o aluno visualize apenas o seu próprio perfil
CREATE POLICY "Alunos podem ver seus próprios perfis" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Permite que o aluno atualize o seu contador de uso
CREATE POLICY "Alunos podem atualizar seus próprios perfis" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Permite que o perfil seja criado automaticamente no primeiro acesso/cadastro
CREATE POLICY "Alunos podem inserir seus próprios perfis" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 4. FUNÇÃO PARA ATUALIZAR TIMESTAMP
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Verifica se o trigger já existe antes de criar
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_profiles_updated') THEN
    CREATE TRIGGER on_profiles_updated
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;
