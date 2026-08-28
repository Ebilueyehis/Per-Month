import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import type { Tag } from '../data/plan';

export function Card({
  children,
  className,
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4',
        dark ? 'border-black/40 bg-board text-white/90' : 'border-line bg-white',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/80',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  right,
  className,
}: {
  title: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-2.5 flex items-end justify-between gap-3', className)}>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink">{title}</h2>
      {right}
    </div>
  );
}

const TAG_STYLES: Record<Tag, string> = {
  RICE: 'bg-[#F1F3EC] text-[#4A5340] border-[#DFE3D3]',
  BEANS: 'bg-[#F3EDE3] text-[#6B5334] border-[#E7DCC9]',
  PASTA: 'bg-[#FDEFE3] text-[#8A4B1E] border-[#F3DCC4]',
  'SWEET POTATO': 'bg-[#FBEEE0] text-[#8A4A16] border-[#F0D9BE]',
  PLANTAIN: 'bg-[#FBF3DA] text-[#7A5B10] border-[#EFE2B8]',
  SOUP: 'bg-[#E7F2EA] text-[#1E6B42] border-[#CDE5D6]',
  EGG: 'bg-[#FCEFE6] text-[#9A4A15] border-[#F2DCC8]',
  FISH: 'bg-[#F1F2F4] text-[#5C6470] border-[#DFE3E9]',
};

export function MealTag({ tag, small }: { tag: Tag; small?: boolean }) {
  const isFish = tag === 'FISH';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-semibold uppercase tracking-wider',
        small ? 'px-1.5 py-[1px] text-[8px]' : 'px-1.5 py-[2px] text-[9px]',
        TAG_STYLES[tag],
      )}
    >
      {isFish ? 'FISH*' : tag}
    </span>
  );
}

/** Fluid ring — scales with CSS, works at phone and desktop sizes. */
export function Ring({
  pct,
  className,
  stroke = 8,
  children,
}: {
  pct: number;
  className?: string;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = 50 - stroke / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className={cn('relative grid place-items-center', className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/12" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#ringgrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * p) / 100}
          style={{ transition: 'stroke-dashoffset .5s ease' }}
        />
        <defs>
          <linearGradient id="ringgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E7A4B" />
            <stop offset="55%" stopColor="#E0A233" />
            <stop offset="100%" stopColor="#C9542A" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function DayStepper({
  day,
  setDay,
  compact,
}: {
  day: number;
  setDay: (d: number) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1">
      <button
        onClick={() => setDay(Math.max(1, day - 1))}
        disabled={day === 1}
        aria-label="Previous day"
        className="grid h-6 w-6 place-items-center rounded-full text-ink-soft transition hover:bg-[#F3F1EA] active:scale-95 disabled:opacity-25"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <span
        className={cn(
          'text-center font-extrabold uppercase text-ink tabular-nums whitespace-nowrap',
          compact ? 'min-w-[42px] text-[10px] tracking-[0.02em]' : 'min-w-[74px] text-[11px] tracking-[0.1em]',
        )}
      >
        {compact ? `${String(day).padStart(2, '0')} / 30` : `Day ${String(day).padStart(2, '0')} / 30`}
      </span>
      <button
        onClick={() => setDay(Math.min(30, day + 1))}
        disabled={day === 30}
        aria-label="Next day"
        className="grid h-6 w-6 place-items-center rounded-full text-ink-soft transition hover:bg-[#F3F1EA] active:scale-95 disabled:opacity-25"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

export function Bar({ pct, tone = 'leaf' }: { pct: number; tone?: 'leaf' | 'clay' | 'amber' }) {
  const tones = {
    leaf: 'bg-leaf',
    clay: 'bg-clay',
    amber: 'bg-amber',
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEAE1]">
      <div
        className={cn('h-full rounded-full transition-all duration-500', tones[tone])}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}

export function Check({
  checked,
  onClick,
  label,
  sub,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5 text-left transition active:scale-[0.99]"
    >
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-[7px] border-2 transition',
          checked ? 'border-leaf bg-leaf text-white' : 'border-[#CFCBC0] bg-white',
        )}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-[13px] font-medium text-ink',
            checked && 'text-ink-soft/70 line-through',
          )}
        >
          {label}
        </span>
        {sub && <span className="block text-[10px] text-ink-soft">{sub}</span>}
      </span>
    </button>
  );
}

export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'leaf' | 'amber' | 'clay' | 'slate';
}) {
  const tones = {
    neutral: 'bg-[#F3F1EA] text-ink-soft border-line',
    leaf: 'bg-leaf-soft text-[#1A6B42] border-[#CBE6D6]',
    amber: 'bg-amber-soft text-[#8A5B10] border-[#F0DDAF]',
    clay: 'bg-clay-soft text-[#A2401A] border-[#F1D3C3]',
    slate: 'bg-[#F2F3F5] text-[#5C6470] border-[#DFE3E9]',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[10px] font-semibold tracking-wide',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
