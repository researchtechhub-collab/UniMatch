import { useMemo, useState } from 'react';
import { Check, Lock, Search, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { academicCategories, budgetRanges, combinedGpaWaiverGuide, dhakaAreas, priorityOptions, type StudentProfile, waiverBands } from '@/types';
import { AdCarousel } from '@/components/shared/AdCarousel';

interface FinderPageProps {
  onNavigate: (path: string) => void;
  isLoggedIn: boolean;
}

const groups = [
  { value: 'science', label: 'Science' },
  { value: 'business', label: 'Business Studies' },
  { value: 'humanities', label: 'Humanities' },
  { value: 'other', label: 'Other' },
] as const;

const steps = ['Academic Background', 'Financial Constraints', 'Location Preferences', 'Academic Interest', 'Customize Your Preferences'] as const;

function movePriority(list: StudentProfile['orderedPriorities'], index: number, direction: -1 | 1) {
  const next = [...list];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function FinderPage({ onNavigate, isLoggedIn }: FinderPageProps) {
  const draftProfile = useAppStore((state) => state.draftProfile);
  const updateDraftProfile = useAppStore((state) => state.updateDraftProfile);
  const submitProfile = useAppStore((state) => state.submitProfile);
  const recommendations = useAppStore((state) => state.recommendations);

  const [stepIndex, setStepIndex] = useState(0);
  const [areaQuery, setAreaQuery] = useState('');

  const filteredAreas = useMemo(() => dhakaAreas.filter((area) => area.label.toLowerCase().includes(areaQuery.toLowerCase())), [areaQuery]);
  const selectedAreas = draftProfile.preferredAreas ?? [];
  const selectedInterests = draftProfile.academicInterests ?? [];
  const orderedPriorities = draftProfile.orderedPriorities ?? priorityOptions.map((item) => item.id);

  const formIsValid = Boolean(
    draftProfile.hscGpa && draftProfile.hscGroup && draftProfile.hscPassingYear && draftProfile.sscGpa && draftProfile.sscGroup && draftProfile.sscPassingYear && draftProfile.budgetRange && draftProfile.availableWaiver,
  );

  const completeSubmission = () => {
    if (!formIsValid) return;
    submitProfile({
      hscGpa: Number(draftProfile.hscGpa),
      hscGroup: draftProfile.hscGroup!,
      hscPassingYear: Number(draftProfile.hscPassingYear),
      sscGpa: Number(draftProfile.sscGpa),
      sscGroup: draftProfile.sscGroup!,
      sscPassingYear: Number(draftProfile.sscPassingYear),
      budgetRange: draftProfile.budgetRange!,
      availableWaiver: draftProfile.availableWaiver!,
      preferredAreas: selectedAreas,
      academicInterests: selectedInterests,
      orderedPriorities,
    });
    setStepIndex(4);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[320px_1fr] md:px-6">
      <aside className="h-fit rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Find My Universities</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Five simple steps</h1>
        <div className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <button key={step} onClick={() => setStepIndex(index)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${stepIndex === index ? 'bg-[#17122f] text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${stepIndex > index ? 'bg-emerald-300 text-slate-950' : 'bg-white/10 text-white'}`}>{stepIndex > index ? <Check className="h-4 w-4" /> : index + 1}</span>
              <span>{step}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-[#17122f] p-4 text-sm text-slate-300">
          <p className="font-medium text-white">Available Waiver guide</p>
          <div className="mt-3 space-y-2">
            {combinedGpaWaiverGuide.map((item) => (
              <p key={item.minimum}>{item.minimum.toFixed(1)}+ combined GPA → {item.waiver}</p>
            ))}
          </div>
        </div>
      </aside>

      <main className="space-y-8">
        {stepIndex === 0 ? (
          <section className="rounded-[32px] border border-white/10 bg-[#130f26] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">Step 1 · Academic Background</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">What is your HSC GPA?
                <input type="number" min="1" max="5" step="0.01" value={draftProfile.hscGpa ?? ''} onChange={(event) => updateDraftProfile({ hscGpa: Number(event.target.value) })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">HSC group
                <select value={draftProfile.hscGroup ?? ''} onChange={(event) => updateDraftProfile({ hscGroup: event.target.value as StudentProfile['hscGroup'] })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                  <option value="">Select</option>
                  {groups.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">HSC passing year
                <input type="number" min="2018" max="2026" value={draftProfile.hscPassingYear ?? ''} onChange={(event) => updateDraftProfile({ hscPassingYear: Number(event.target.value) })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">What is your SSC GPA?
                <input type="number" min="1" max="5" step="0.01" required value={draftProfile.sscGpa ?? ''} onChange={(event) => updateDraftProfile({ sscGpa: Number(event.target.value) })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">SSC group
                <select value={draftProfile.sscGroup ?? ''} onChange={(event) => updateDraftProfile({ sscGroup: event.target.value as StudentProfile['sscGroup'] })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                  <option value="">Select</option>
                  {groups.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">SSC passing year
                <input type="number" min="2016" max="2024" value={draftProfile.sscPassingYear ?? ''} onChange={(event) => updateDraftProfile({ sscPassingYear: Number(event.target.value) })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
            </div>
          </section>
        ) : null}

        {stepIndex === 1 ? (
          <section className="rounded-[32px] border border-white/10 bg-[#130f26] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">Step 2 · Financial Constraints</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">Select your total budget range
                <select value={draftProfile.budgetRange ?? ''} onChange={(event) => updateDraftProfile({ budgetRange: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                  <option value="">Select a range</option>
                  {budgetRanges.map((range) => <option key={range} value={range}>{range}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">Available Waiver
                <select value={draftProfile.availableWaiver ?? ''} onChange={(event) => updateDraftProfile({ availableWaiver: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                  <option value="">Choose expected waiver band</option>
                  {waiverBands.map((band) => <option key={band} value={band}>{band}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-medium text-white">How waiver estimates are modeled</p>
              <p className="mt-2 leading-7">UniMatch estimates likely tuition fee waivers from academic results, using combined HSC + SSC GPA ranges to mirror common private university merit bands.</p>
            </div>
          </section>
        ) : null}

        {stepIndex === 2 ? (
          <section className="rounded-[32px] border border-white/10 bg-[#130f26] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">Step 3 · Location Preferences</h2>
            <label className="relative mt-6 block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={areaQuery} onChange={(event) => setAreaQuery(event.target.value)} placeholder="Search Dhaka areas like Uttara, Banani, Ashulia, Farmgate, Mirpur..." className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white outline-none" />
            </label>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredAreas.map((area) => {
                const active = selectedAreas.includes(area.id);
                return (
                  <button key={area.id} onClick={() => updateDraftProfile({ preferredAreas: active ? selectedAreas.filter((item) => item !== area.id) : [...selectedAreas, area.id] })} className={`rounded-[24px] border p-4 text-left transition ${active ? 'border-emerald-300 bg-emerald-300/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <p className="font-medium text-white">{area.label}</p>
                    <p className="mt-1 text-sm text-slate-300">{area.livingCost}</p>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {stepIndex === 3 ? (
          <section className="rounded-[32px] border border-white/10 bg-[#130f26] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">Step 4 · Academic Interest</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {academicCategories.map((category) => {
                const selected = selectedInterests.includes(category.id);
                return (
                  <button key={category.id} onClick={() => updateDraftProfile({ academicInterests: selected ? selectedInterests.filter((item) => item !== category.id) : [...selectedInterests, category.id] })} className={`rounded-[28px] border p-5 text-left transition ${selected ? 'border-emerald-300 bg-emerald-300/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <p className="text-lg font-semibold text-white">{category.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Example majors: {category.examples.join(', ')}</p>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {stepIndex === 4 ? (
          <section className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-[#130f26] p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Step 5 · Customize Your Preferences</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">Optional: reorder the five factors below from highest to lowest priority.</p>
                </div>
                <button onClick={() => updateDraftProfile({ orderedPriorities: [] })} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">Use default order</button>
              </div>
              <div className="mt-6 space-y-3">
                {orderedPriorities.map((priority, index) => {
                  const label = priorityOptions.find((item) => item.id === priority)?.label ?? priority;
                  return (
                    <div key={priority} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Priority #{index + 1}</p>
                        <p className="mt-1 font-medium text-white">{label}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateDraftProfile({ orderedPriorities: movePriority(orderedPriorities, index, -1) })} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">Up</button>
                        <button onClick={() => updateDraftProfile({ orderedPriorities: movePriority(orderedPriorities, index, 1) })} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">Down</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={completeSubmission} disabled={!formIsValid} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-lime-200 to-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
                  <Sparkles className="h-4 w-4" /> Generate recommendations
                </button>
                <button onClick={() => onNavigate('/universities')} className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Browse universities instead
                </button>
              </div>
            </div>

            <AdCarousel />

            <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Recommendations</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">Match score visibility is reserved for logged-in users who have submitted their information.</p>
                </div>
                {!isLoggedIn ? <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100"><Lock className="h-4 w-4" /> Login to unlock matching points</p> : null}
              </div>
              <div className="mt-6 grid gap-4">
                {recommendations.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-white/15 p-6 text-sm text-slate-400">Complete the form above to generate your personalized shortlist.</div>
                ) : recommendations.map((item) => (
                  <article key={item.program.id} className="rounded-[28px] border border-white/10 bg-[#17122f] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">{item.university.shortName}</p>
                        <h4 className="mt-2 text-xl font-semibold text-white">{item.program.name}</h4>
                        <p className="mt-1 text-sm text-slate-300">{item.university.name}</p>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                        {isLoggedIn ? <span className="text-2xl font-semibold text-white">{item.score}/100</span> : <span>Score hidden for guests</span>}
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Total cost<br /><span className="mt-1 block text-lg font-semibold text-white">৳{item.program.totalCost.toLocaleString()}</span></div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Minimum GPA<br /><span className="mt-1 block text-lg font-semibold text-white">{item.program.minimumGpa.toFixed(1)}</span></div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Waiver estimate<br /><span className="mt-1 block text-sm leading-6 text-white">{item.waiverEstimate}</span></div>
                    </div>
                    <ul className="mt-5 space-y-2 text-sm text-slate-300">
                      {item.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          </section>
        ) : null}

        <div className="flex justify-between gap-3">
          <button onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0} className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <button onClick={() => setStepIndex((current) => Math.min(4, current + 1))} disabled={stepIndex === 4} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </div>
      </main>
    </div>
  );
}
