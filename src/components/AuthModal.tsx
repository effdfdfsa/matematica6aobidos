import { useEffect, useState, type FormEvent } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { inputClass, primaryButtonClass } from '@/lib/styles';

export type AuthMode = 'signin' | 'signup';

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
};

const MODE_COPY: Record<AuthMode, { title: string; subtitle: string; submit: string }> = {
  signin: {
    title: 'Entrar na tua conta',
    subtitle: 'Guarda o teu progresso nos exercícios.',
    submit: 'Entrar',
  },
  signup: {
    title: 'Criar conta',
    subtitle: 'Cria uma conta gratuita para guardar os teus resultados.',
    submit: 'Criar conta',
  },
};

export function AuthModal({ open, mode, onModeChange, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError(null);
    setPassword('');
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const copy = MODE_COPY[mode];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const trimmedEmail = email.trim();
    const result =
      mode === 'signin'
        ? await signIn(trimmedEmail, password)
        : await signUp(trimmedEmail, password);
    setSubmitting(false);
    if (result) {
      setError(result);
      return;
    }
    setPassword('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900">
              {copy.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{copy.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(['signin', 'signup'] as AuthMode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onModeChange(option)}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                mode === option
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {option === 'signin' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="auth-email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="auth-password" className="text-sm font-semibold text-slate-700">
              Palavra-passe
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
            {mode === 'signup' && (
              <span className="text-xs text-slate-500">Mínimo de 6 caracteres.</span>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className={`${primaryButtonClass} mt-2`}>
            {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {copy.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
