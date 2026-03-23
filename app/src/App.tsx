import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { AboutPage } from '@/pages/AboutPage';
import { FinderPage } from '@/pages/FinderPage';
import { LandingPage } from '@/pages/LandingPage';
import { UniversitiesPage } from '@/pages/UniversitiesPage';
import { UniversityDetailPage } from '@/pages/UniversityDetailPage';
import { useAppStore } from '@/store/appStore';

function normalizePath(path: string): string {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname || '/'));
  const { isLoggedIn, login, submittedProfile } = useAppStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    login: state.login,
    submittedProfile: state.submittedProfile,
  }));

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname || '/'));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPath: string) => {
    if (nextPath.startsWith('/#')) {
      window.history.pushState({}, '', '/');
      setPath('/');
      window.setTimeout(() => document.getElementById(nextPath.slice(2))?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }
    if (nextPath === path) return;
    window.history.pushState({}, '', nextPath);
    setPath(normalizePath(nextPath));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  let page = <LandingPage onNavigate={navigate} />;
  if (path === '/about') page = <AboutPage />;
  else if (path === '/finder') page = <FinderPage onNavigate={navigate} isLoggedIn={isLoggedIn} />;
  else if (path === '/universities') page = <UniversitiesPage onNavigate={navigate} />;
  else if (path.startsWith('/universities/')) page = <UniversityDetailPage universityId={path.replace('/universities/', '')} isLoggedIn={isLoggedIn} submittedProfile={submittedProfile} />;

  return (
    <div className="min-h-screen bg-[#0b0917] text-white">
      <div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.35),transparent_38%),radial-gradient(circle_at_30%_10%,rgba(16,185,129,0.16),transparent_24%)] pointer-events-none" />
      <div className="relative">
        <SiteHeader currentPath={path} onNavigate={navigate} isLoggedIn={isLoggedIn} onLogin={() => login('UniMatch User')} />
        {page}
        <SiteFooter onNavigate={navigate} />
      </div>
      <Toaster richColors />
    </div>
  );
}
