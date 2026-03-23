import { useMemo, useState } from 'react';
import { ArrowUpDown, BadgeInfo, Building2, Filter } from 'lucide-react';
import { universities } from '@/data/universities';
import { dhakaAreas } from '@/types';
import { AdCarousel } from '@/components/shared/AdCarousel';
import { SectionHeading } from '@/components/shared/SectionHeading';

interface UniversitiesPageProps {
  onNavigate: (path: string) => void;
}

type SortKey = 'ranking' | 'tuitionLow' | 'tuitionHigh' | 'status';

export function UniversitiesPage({ onNavigate }: UniversitiesPageProps) {
  const [sortKey, setSortKey] = useState<SortKey>('ranking');
  const [ugcFilter, setUgcFilter] = useState<'all' | 'approved' | 'warning'>('all');

  const filtered = useMemo(() => {
    const next = universities.filter((item) => ugcFilter === 'all' || item.ugcStatus === ugcFilter);
    return next.sort((a, b) => {
      if (sortKey === 'ranking') return a.ranking - b.ranking;
      if (sortKey === 'tuitionLow') return a.tuitionRange[0] - b.tuitionRange[0];
      if (sortKey === 'tuitionHigh') return a.tuitionRange[1] - b.tuitionRange[1];
      if (a.ugcStatus !== b.ugcStatus) return a.ugcStatus === 'approved' ? -1 : 1;
      return a.ranking - b.ranking;
    });
  }, [sortKey, ugcFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 md:px-6">
      <section className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <SectionHeading
          badge="Universities"
          title="Private universities in Dhaka Zila"
          description="Browse structured local seed data for Dhaka private universities, then open each profile for departments, costs, eligibility, contact details, waivers, and official website links."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm text-slate-300">
            <span className="mb-2 flex items-center gap-2 text-white"><ArrowUpDown className="h-4 w-4 text-emerald-200" /> Sort by</span>
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#17122f] px-3 py-2 text-white outline-none">
              <option value="ranking">Ranking</option>
              <option value="tuitionLow">Lowest tuition</option>
              <option value="tuitionHigh">Highest tuition ceiling</option>
              <option value="status">UGC status</option>
            </select>
          </label>
          <label className="rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm text-slate-300">
            <span className="mb-2 flex items-center gap-2 text-white"><Filter className="h-4 w-4 text-emerald-200" /> Filter</span>
            <select value={ugcFilter} onChange={(event) => setUgcFilter(event.target.value as 'all' | 'approved' | 'warning')} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#17122f] px-3 py-2 text-white outline-none">
              <option value="all">All</option>
              <option value="approved">UGC Approved</option>
              <option value="warning">UGC Warning</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {filtered.map((university) => {
          const area = dhakaAreas.find((item) => item.id === university.areaId);
          return (
            <article key={university.id} className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-200 to-emerald-300 font-semibold text-slate-950">
                    {university.logoSeed}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{university.name}</h2>
                    <p className="mt-1 text-sm text-slate-300">Rank #{university.ranking} · {area?.label} · {area?.livingCost}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${university.ugcStatus === 'approved' ? 'bg-emerald-400/10 text-emerald-200' : 'bg-amber-400/10 text-amber-200'}`}>
                  {university.ugcStatus === 'approved' ? 'UGC Approved' : 'UGC Warning'}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">{university.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#17122f] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Tuition band</p>
                  <p className="mt-2 text-lg font-semibold text-white">৳{university.tuitionRange[0].toLocaleString()} – ৳{university.tuitionRange[1].toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#17122f] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Admission note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{university.admissionBanner}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {university.strengths.map((strength) => (
                  <span key={strength} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{strength}</span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2 text-sm text-slate-400"><BadgeInfo className="h-4 w-4 text-emerald-200" /> {university.ugcNote}</div>
                <button onClick={() => onNavigate(`/universities/${university.id}`)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                  View details
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <AdCarousel />

      <section className="rounded-[32px] border border-white/10 bg-[#130f26] p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">Why this page matters</h3>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">Students can browse every available Dhaka private university without signing in, while personalized matching points only appear after login and form submission.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
