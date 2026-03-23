import { AlertTriangle, BarChart3, Compass, Sparkles } from 'lucide-react';
import { AdCarousel } from '@/components/shared/AdCarousel';
import { SectionHeading } from '@/components/shared/SectionHeading';

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 md:px-6">
      <section className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">About UniMatch</span>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">A visual story of why this product matters</h1>
          <p className="text-lg leading-8 text-slate-300">
            Students in Bangladesh encounter significant challenges when selecting universities, particularly private institutions, after completing their Higher Secondary Certificate (HSC) exams.
          </p>
          <p className="text-base leading-7 text-slate-300">
            Too many students compare disconnected Facebook posts, outdated tuition figures, rumor-based scholarship claims, and incomplete university websites. UniMatch turns that confusion into a guided, structured, and confidence-building decision journey.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Fragmented information', 'Students jump between websites, admission posters, and hearsay.'],
            ['High financial pressure', 'A wrong choice can mean fees, living costs, and waiver assumptions do not match reality.'],
            ['Dhaka complexity', 'Area choice affects commuting, living costs, and daily student life.'],
            ['Program uncertainty', 'Departments, GPA thresholds, and university reputation are hard to compare side by side.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <p className="text-lg font-semibold text-white">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-white/10 bg-[#130f26] p-8 md:p-10">
        <SectionHeading
          badge="The challenge"
          title="What makes private university selection so difficult?"
          description="After HSC, students and guardians need to compare approval status, costs, scholarships, location convenience, and academic fit—all on tight timelines."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <AlertTriangle className="h-8 w-8 text-emerald-200" />
            <h3 className="mt-4 text-xl font-semibold text-white">Approval risk</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Students do not always know which institutions or programs carry approval concerns. UniMatch makes UGC status the highest-priority signal.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <BarChart3 className="h-8 w-8 text-emerald-200" />
            <h3 className="mt-4 text-xl font-semibold text-white">Price mismatch</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Sticker tuition is only one part of the picture. Students also need waiver expectations and area living-cost signals.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <Compass className="h-8 w-8 text-emerald-200" />
            <h3 className="mt-4 text-xl font-semibold text-white">Decision overload</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">When every campus claims to be the best fit, students need a calmer system that reflects their own priorities.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">How UniMatch solves it</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">A guided engine, not a blog post</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            UniMatch combines seed data for Dhaka private universities, academic eligibility, tuition ranges, likely waiver bands, and Dhaka area cost labels into one coordinated recommendation system.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['1', 'Structured academic form', 'Exact HSC/SSC GPA, groups, and passing years shape eligibility.'],
            ['2', 'Budget and waiver modeling', 'Budget bands plus likely merit waiver estimates create more realistic affordability matching.'],
            ['3', 'Dhaka area preference', 'Students can search for Uttara, Banani, Ashulia, Mirpur, Gulshan, and more.'],
            ['4', 'Transparent results', 'Logged-in users who submit the form can see match points and reasons for each recommendation.'],
          ].map(([step, title, body]) => (
            <div key={step} className="rounded-[28px] border border-white/10 bg-[#17122f] p-6">
              <p className="text-sm font-semibold text-emerald-200">Step {step}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <AdCarousel />

      <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 md:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-white">Outcome</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
              UniMatch gives Bangladeshi students a more trustworthy first shortlist: approval-aware, Dhaka-specific, financially realistic, and easier to compare. Instead of pushing content, it helps students move from anxiety to action.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
