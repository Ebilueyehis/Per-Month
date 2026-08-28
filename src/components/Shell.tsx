import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { DayStepper } from './Primitives';

export type Tab = 'today' | 'plan' | 'market' | 'kitchen';

export const TABS: { id: Tab; label: string; icon: ReactNode; section: string }[] = [
  {
    id: 'today',
    label: 'Today',
    section: 'Today',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18M8 3v3M16 3v3" />
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M8 14h3" />
      </svg>
    ),
  },
  {
    id: 'plan',
    label: '30-Day',
    section: 'Calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16M4 12h16M4 19h10" />
      </svg>
    ),
  },
  {
    id: 'market',
    label: 'Market',
    section: 'Market',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h16l-1.2 10.2a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3L4 9Z" />
        <path d="M8.5 9V6.8A3.5 3.5 0 0 1 15.5 6.8V9" />
      </svg>
    ),
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    section: 'Kitchen',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3v7a3 3 0 0 0 6 0V3M9 13v8" />
        <path d="M17 3c-1.2 1.6-2 3-2 5s.8 2.6 2 2.6S19 10 19 8s-.8-3.4-2-5Z" />
        <path d="M17 13v8" />
      </svg>
    ),
  },
];

/** Tracks a media query and re-renders on change (fluid layout switching). */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

export function TopBar({
  day,
  setDay,
  tab,
  setTab,
  isDesktop,
}: {
  day: number;
  setDay: (d: number) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  isDesktop: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1680px] items-center gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-leaf text-[15px] font-black text-white">
            ₦
          </div>
          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-[14px] font-extrabold leading-tight tracking-[-0.01em] text-ink sm:text-[16px]">
              <span className="sm:hidden">₦40K KITCHEN</span>
              <span className="hidden sm:inline">₦40K STUDENT KITCHEN</span>
            </h1>
            <p className="hidden text-[10.5px] font-medium text-ink-soft sm:block">
              Lagos • 30 days • 60 meals • No fridge
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isDesktop && (
            <nav className="mr-1 hidden items-center gap-1 rounded-full border border-line bg-white p-1 lg:flex">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    document
                      .getElementById(`section-${t.id}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition',
                    tab === t.id ? 'bg-ink text-white' : 'text-ink-soft hover:bg-[#F3F1EA]',
                  )}
                >
                  {t.section}
                </button>
              ))}
            </nav>
          )}
          <DayStepper day={day} setDay={setDay} compact={!isDesktop} />
        </div>
      </div>
    </header>
  );
}

export function BottomTabs({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-[3px] rounded-xl py-1.5 transition',
              tab === t.id ? 'text-leaf' : 'text-ink-soft/70',
            )}
          >
            {t.icon}
            <span className="text-[10px] font-semibold tracking-wide">{t.label}</span>
            <span
              className={cn('h-1 w-1 rounded-full', tab === t.id ? 'bg-leaf' : 'bg-transparent')}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2 px-1">
      <div>
        <p className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-ink-soft/80">
          {eyebrow}
        </p>
        <h2 className="text-[15px] font-extrabold uppercase tracking-[0.06em] text-ink">
          {title}
        </h2>
      </div>
      {hint && <p className="text-[10.5px] font-medium text-ink-soft">{hint}</p>}
    </div>
  );
}
