import type { ReactNode } from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}

export function SectionHeading({ badge, title, description, align = 'left', action }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : ''}`}>
      {badge ? <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">{badge}</span> : null}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}
