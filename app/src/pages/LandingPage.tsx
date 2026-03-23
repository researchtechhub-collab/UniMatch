import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Building2, CheckCircle2, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { siteStats, universities } from '@/data/universities';
import { academicCategories, dhakaAreas } from '@/types';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { AdCarousel } from '@/components/shared/AdCarousel';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

const whyChoose = [
  {
    title: 'UGC-first recommendations',
    description: 'UGC approved universities always appear before UGC warning institutions in every ranked list.',
  },
  {
    title: 'Completely practical for students',
    description: 'Compare Dhaka tuition, living area costs, admissions, waivers, and program options from one place.',
  },
  {
    title: 'AI-guided personalization',
    description: 'Simple ordered priorities replace confusing weighting so recommendations feel more intuitive.',
  },
  {
    title: 'Bangladesh’s first AI-powered centralised universities information provider.',
    description: 'A focused discovery layer that organizes private university information into one decision-ready flow.',
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="space-y-14 pb-16 md:space-y-20">
      <section className="relative overflow-hidden pt-10 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_38%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr] md:px-6">
          <div className="space-y-8 py-8 md:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-200">
              <Sparkles className="h-4 w-4" /> AI-powered university matching for Dhaka private universities
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Find Your Perfect <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">University Match</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Struggling to choose the right private university after HSC? Our AI-powered platform analyzes your profile and recommends the best-matched universities in Bangladesh based on your GPA, budget, and preferences.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-3xl font-semibold text-white">{siteStats.universities}</p>
                <p className="mt-1 text-sm text-slate-300">universities</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-3xl font-semibold text-white">{siteStats.departments}</p>
                <p className="mt-1 text-sm text-slate-300">departments</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-3xl font-semibold text-white">{siteStats.decisionsSupported.toLocaleString()}</p>
                <p className="mt-1 text-sm text-slate-300">users who made their decision with us</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button onClick={() => onNavigate('/finder')} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-lime-200 to-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-105">
                Find My Universities
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => onNavigate('/universities')} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Explore Universities
              </button>
            </div>

            <div className="pt-5">
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white">
                Learn More <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-[500px] items-end justify-center py-6">
            <div className="absolute inset-0 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl" />
            <div className="relative grid w-full gap-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-[#211a3f] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">UGC logic</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Approved first</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Warning universities never outrank approved ones.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[28px] border border-white/10 bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Areas</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{dhakaAreas.length} Dhaka zones</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">From Uttara and Banani to Ashulia and Motijheel.</p>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Popular categories</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Choose what matters most</h3>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-emerald-200" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {academicCategories.slice(0, 6).map((category) => (
                    <div key={category.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="font-medium text-white">{category.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{category.examples.join(' · ')}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <div className="flex animate-[marquee_28s_linear_infinite] gap-5 whitespace-nowrap">
            {[...universities, ...universities].map((university, index) => (
              <div key={`${university.id}-${index}`} className="inline-flex min-w-[280px] items-center gap-4 rounded-[24px] border border-white/10 bg-[#17122f] px-5 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-200 to-emerald-300 font-semibold text-slate-950">
                  {university.logoSeed}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{university.shortName}</p>
                  <p className="text-xs text-slate-300">{university.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[36px] border border-white/10 bg-[#130f26] p-8 md:p-10">
          <SectionHeading
            badge="How it works"
            title="A clean five-step flow from profile to shortlist"
            description="Tell us about your GPA, budget, preferred locations, and academic interests. UniMatch then turns those inputs into a realistic Dhaka private university shortlist."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ['01', 'Academic background', 'Exact HSC GPA, SSC GPA, group, and passing year are captured up front.'],
              ['02', 'Financial constraints', 'Budget ranges and likely waiver bands shape affordability.'],
              ['03', 'Dhaka area matching', 'Search and select preferred areas with living-cost labels.'],
              ['04', 'Academic interests', 'Choose from practical category clusters and example majors.'],
            ].map(([step, title, body]) => (
              <div key={step} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{step}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <AdCarousel />
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionHeading
              badge="Why UniMatch"
              title="Why Choose UniMatch?"
              description="The experience is tuned for Bangladeshi students comparing Dhaka private universities, not a generic school search product."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {whyChoose.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-[#17122f] p-6">
              <Building2 className="h-8 w-8 text-emerald-200" />
              <p className="mt-4 text-2xl font-semibold text-white">Structured local seed data</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Dhaka-focused university, department, contact, tuition, and waiver data keep the product realistic when live feeds are unavailable.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <UsersRound className="h-8 w-8 text-emerald-200" />
              <p className="mt-4 text-2xl font-semibold text-white">User-friendly personalization</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Logged-in students who submit their information see match points; anonymous visitors can still browse everything else.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <Sparkles className="h-8 w-8 text-emerald-200" />
              <p className="mt-4 text-2xl font-semibold text-white">Responsive, routed, modular</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Landing, about, universities, details, and finder all share the same polished shell and mobile-friendly layout.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
