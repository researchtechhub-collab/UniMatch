import { Menu, GraduationCap, Plus, Building2 } from 'lucide-react';

interface SiteHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const navItems = [
  { label: 'How It Works', path: '/#how-it-works' },
  { label: 'Universities', path: '/universities' },
  { label: 'About', path: '/about' },
  { label: 'Add Universities', path: 'mailto:partners@unimatch.app?subject=Add%20Universities' },
];

export function SiteHeader({ currentPath, onNavigate, isLoggedIn, onLogin }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#120f24]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <button onClick={() => onNavigate('/')} className="flex items-center gap-3 text-left">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-200 shadow-[0_10px_30px_rgba(16,185,129,0.15)]">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight text-white">UniMatch</span>
            <span className="block text-xs text-slate-400">Dhaka private university matcher</span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            item.path.startsWith('mailto:') ? (
              <a key={item.label} href={item.path} className="text-sm text-slate-300 transition hover:text-white">{item.label}</a>
            ) : (
              <button
                key={item.label}
                onClick={() => onNavigate(item.path)}
                className={`text-sm transition ${currentPath === item.path ? 'text-white' : 'text-slate-300 hover:text-white'}`}
              >
                {item.label}
              </button>
            )
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={onLogin} className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
            {isLoggedIn ? 'Logged in' : 'Login'}
          </button>
          <button onClick={onLogin} className="rounded-full bg-gradient-to-r from-lime-200 to-emerald-300 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-105">
            {isLoggedIn ? 'Go to matches' : 'Create an account'}
          </button>
        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-slate-200 lg:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div className="border-t border-white/5 bg-white/5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 py-2 text-xs text-slate-300 md:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1"><Building2 className="h-3.5 w-3.5 text-emerald-200" /> All pages share the same landing-style shell</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1"><Plus className="h-3.5 w-3.5 text-emerald-200" /> University banner placements supported</span>
        </div>
      </div>
    </header>
  );
}
