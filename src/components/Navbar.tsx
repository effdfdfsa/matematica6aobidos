import { useState } from 'react';
import { LogOut, Menu, Sigma, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, type RouteId } from '@/lib/routes';
import { SITE_NAME } from '@/lib/site';
import { primaryButtonClass, secondaryButtonClass } from '@/lib/styles';
import type { AuthMode } from '@/components/AuthModal';

type NavbarProps = {
  route: RouteId;
  onNavigate: (route: RouteId) => void;
  onOpenAuth: (mode: AuthMode) => void;
};

export function Navbar({ route, onNavigate, onOpenAuth }: NavbarProps) {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (next: RouteId) => {
    onNavigate(next);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => go('inicio')}
          className="flex items-center gap-2 font-bold text-slate-900 transition hover:text-teal-700"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Sigma className="h-5 w-5" />
          </span>
          <span className="text-lg">{SITE_NAME}</span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {ROUTES.filter((item) => item.id !== 'inicio').map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              aria-current={route === item.id ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                route === item.id
                  ? 'bg-teal-50 text-teal-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && user && (
            <>
              <span className="max-w-[12rem] truncate text-sm text-slate-600">{user.email}</span>
              <button
                type="button"
                onClick={() => signOut()}
                className={`${secondaryButtonClass} px-4 py-2 text-sm`}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </>
          )}
          {!loading && !user && (
            <>
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className={`${primaryButtonClass} px-4 py-2 text-sm`}
              >
                Criar conta
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Principal móvel">
            {ROUTES.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={route === item.id ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                    route === item.id ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
            {!loading && user && (
              <>
                <span className="px-3 text-sm text-slate-600">{user.email}</span>
                <button type="button" onClick={() => signOut()} className={secondaryButtonClass}>
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </>
            )}
            {!loading && !user && (
              <>
                <button type="button" onClick={() => onOpenAuth('signin')} className={secondaryButtonClass}>
                  Entrar
                </button>
                <button type="button" onClick={() => onOpenAuth('signup')} className={primaryButtonClass}>
                  Criar conta
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
