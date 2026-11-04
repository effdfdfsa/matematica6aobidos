import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Email ou palavra-passe incorretos.';
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'Já existe uma conta com este email.';
  }
  if (lower.includes('at least') && lower.includes('character')) {
    return 'A palavra-passe deve ter pelo menos 6 caracteres.';
  }
  if (lower.includes('valid email') || lower.includes('invalid format')) {
    return 'Introduz um email válido.';
  }
  if (lower.includes('fetch') || lower.includes('network')) {
    return 'Sem ligação. Tenta novamente.';
  }
  return 'Não foi possível concluir. Tenta novamente.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      (async () => {
        setSession(nextSession);
        setLoading(false);
      })();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      loading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? translateAuthError(error.message) : null;
      },
      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return translateAuthError(error.message);
        if (data.session) return null;
        const signIn = await supabase.auth.signInWithPassword({ email, password });
        return signIn.error ? translateAuthError(signIn.error.message) : null;
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
