import { useState, type ReactNode } from 'react';
import { AuthModal, type AuthMode } from '@/components/AuthModal';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { useHashRoute } from '@/hooks/useHashRoute';
import type { RouteId } from '@/lib/routes';
import { ExercisesPage } from '@/pages/ExercisesPage';
import { FactorizationPage } from '@/pages/FactorizationPage';
import { GcdLcmPage } from '@/pages/GcdLcmPage';
import { HomePage } from '@/pages/HomePage';
import { PercentagesPage } from '@/pages/PercentagesPage';
import { QuadraticPage } from '@/pages/QuadraticPage';

function AppShell() {
  const [route, navigate] = useHashRoute();
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const pages: Record<RouteId, ReactNode> = {
    inicio: <HomePage onNavigate={navigate} />,
    fatoracao: <FactorizationPage />,
    'mdc-mmc': <GcdLcmPage />,
    equacoes: <QuadraticPage />,
    percentagens: <PercentagesPage />,
    exercicios: <ExercisesPage onOpenAuth={setAuthMode} />,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar route={route} onNavigate={navigate} onOpenAuth={setAuthMode} />
      <main>{pages[route]}</main>
      <AuthModal
        open={authMode !== null}
        mode={authMode ?? 'signin'}
        onModeChange={setAuthMode}
        onClose={() => setAuthMode(null)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
