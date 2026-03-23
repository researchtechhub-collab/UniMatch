import { useEffect, useState } from 'react';
import { Megaphone, ArrowRight } from 'lucide-react';

const ads = [
  {
    title: 'Admission campaign spotlight',
    body: 'Feature your next intake, scholarship week, or campus open day in UniMatch banner placements.',
    cta: 'Promote your university',
  },
  {
    title: 'Merit waiver highlight',
    body: 'Showcase 25%–100% tuition waivers to students comparing Dhaka private universities.',
    cta: 'Reserve this ad space',
  },
  {
    title: 'University fair placement',
    body: 'Run a targeted banner for counseling days, application deadlines, and city-based admission events.',
    cta: 'Book an admission banner',
  },
];

export function AdCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % ads.length), 3200);
    return () => window.clearInterval(timer);
  }, []);

  const current = ads[index];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(20,20,40,0.25)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Admission banner slot</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{current.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{current.body}</p>
          </div>
        </div>
        <a href="mailto:partners@unimatch.app?subject=Add%20Universities" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15">
          {current.cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
