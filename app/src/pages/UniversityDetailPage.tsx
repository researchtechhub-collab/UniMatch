import { Globe, Mail, Phone, ShieldCheck } from 'lucide-react';
import { programs, universities } from '@/data/universities';
import { academicCategories, dhakaAreas, type StudentProfile } from '@/types';
import { getProgramsForUniversity, generateRecommendations } from '@/lib/recommendationEngine';
import { AdCarousel } from '@/components/shared/AdCarousel';

interface UniversityDetailPageProps {
  universityId: string;
  isLoggedIn: boolean;
  submittedProfile: StudentProfile | null;
}

export function UniversityDetailPage({ universityId, isLoggedIn, submittedProfile }: UniversityDetailPageProps) {
  const university = universities.find((item) => item.id === universityId);

  if (!university) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6">
        <h1 className="text-3xl font-semibold text-white">University not found</h1>
        <p className="mt-3 text-slate-400">Please go back to the universities page and choose another profile.</p>
      </div>
    );
  }

  const area = dhakaAreas.find((item) => item.id === university.areaId);
  const detailPrograms = getProgramsForUniversity(university.id);
  const scoreMap = submittedProfile && isLoggedIn
    ? new Map(
        generateRecommendations(submittedProfile, programs.length)
          .filter((item) => item.university.id === university.id)
          .map((item) => [item.program.id, item.score]),
      )
    : new Map<string, number>();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 md:px-6">
      <section className="rounded-[36px] border border-white/10 bg-[#130f26] p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
              <ShieldCheck className="h-4 w-4" /> {university.ugcStatus === 'approved' ? 'UGC Approved' : 'UGC Warning'}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">{university.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{university.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Rank #{university.ranking}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{area?.label} · {area?.livingCost}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Established {university.establishedYear}</span>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 md:min-w-[320px]">
            <p className="font-semibold text-white">Contact information</p>
            <div className="mt-4 space-y-3">
              <p className="flex items-start gap-2"><Phone className="mt-1 h-4 w-4 text-emerald-200" /> {university.phone}</p>
              <p className="flex items-start gap-2"><Mail className="mt-1 h-4 w-4 text-emerald-200" /> {university.email}</p>
              <p className="flex items-start gap-2"><Globe className="mt-1 h-4 w-4 text-emerald-200" /> {university.address}</p>
            </div>
          </div>
        </div>
      </section>

      <AdCarousel />

      <section className="grid gap-5">
        {detailPrograms.map((program) => {
          const category = academicCategories.find((item) => item.id === program.categoryId);
          const matchingScore = scoreMap.get(program.id);
          return (
            <article key={program.id} className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">{category?.title}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{program.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">Department/program card with cost, GPA requirement, contact, waiver, and website routing.</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-[#17122f] px-4 py-3 text-sm text-slate-300">
                  {isLoggedIn && submittedProfile ? (
                    <><span className="block text-xs uppercase tracking-[0.18em] text-emerald-200">Matching points</span><span className="mt-1 block text-2xl font-semibold text-white">{matchingScore ?? '—'}/100</span></>
                  ) : (
                    <><span className="block text-xs uppercase tracking-[0.18em] text-emerald-200">Matching points</span><span className="mt-1 block text-sm text-slate-300">Login and submit your profile to unlock</span></>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Total cost</p>
                  <p className="mt-2 text-lg font-semibold text-white">৳{program.totalCost.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Minimum GPA</p>
                  <p className="mt-2 text-lg font-semibold text-white">{program.minimumGpa.toFixed(1)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Contact</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{program.contact}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Scholarship / waiver</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{program.scholarshipInfo}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <a href={university.website} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                  University Website
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
