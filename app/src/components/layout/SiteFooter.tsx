import { Facebook, Instagram, Mail, MessageCircle, GraduationCap } from 'lucide-react';

interface SiteFooterProps {
  onNavigate: (path: string) => void;
}

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#100d1f]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr] md:px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-semibold text-white">UniMatch</p>
              <p className="text-sm text-slate-400">Bangladesh-focused university decision support</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Structured local seed data powers a complete Dhaka private university discovery experience, even when live admissions data is unavailable.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <button onClick={() => onNavigate('/about')} className="transition hover:text-white">About</button>
            <button onClick={() => onNavigate('/finder')} className="transition hover:text-white">Find My Universities</button>
            <button onClick={() => onNavigate('/universities')} className="transition hover:text-white">Universities</button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <p className="text-sm font-medium text-white">Stay connected</p>
          <div className="flex items-center gap-3 text-slate-300">
            <a href="https://facebook.com" className="rounded-full border border-white/10 p-3 transition hover:bg-white/10" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href="https://instagram.com" className="rounded-full border border-white/10 p-3 transition hover:bg-white/10" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="mailto:hello@unimatch.app" className="rounded-full border border-white/10 p-3 transition hover:bg-white/10" aria-label="Email"><Mail className="h-4 w-4" /></a>
            <a href="https://wa.me/8801000000000" className="rounded-full border border-white/10 p-3 transition hover:bg-white/10" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
          </div>
          <p className="text-right text-sm text-slate-500">© 2026 UniMatch. Designed for confident university decisions.</p>
        </div>
      </div>
    </footer>
  );
}
