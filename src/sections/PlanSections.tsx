import { useMemo, useState } from 'react';
import {
  DAYS,
  PLAN,
  type Tag,
  dayCost,
  mealCost,
  naira,
  pad,
  remainingAfter,
  weekTarget,
  WEEK_RANGES,
} from '../data/plan';
import { Card, MealTag, Pill, SectionTitle } from '../components/Primitives';
import { cn } from '../utils/cn';

const FILTERS: (Tag | 'ALL')[] = [
  'ALL',
  'RICE',
  'BEANS',
  'PASTA',
  'SWEET POTATO',
  'PLANTAIN',
  'SOUP',
  'EGG',
  'FISH',
];

export function PlanSummary({ day }: { day: number }) {
  const daysLeft = 30 - day;
  const spendLeft = PLAN.mealTotal - DAYS.filter((d) => d.day <= day).reduce((s, d) => s + dayCost(d), 0);
  return (
    <Card>
      <SectionTitle
        title="Month at a glance"
        right={<span className="text-[10px] font-semibold text-ink-soft">Day {pad(day)} of 30</span>}
      />
      <div className="grid grid-cols-3 gap-2">
        <Tile label="Days left" value={String(daysLeft)} sub="of 30" />
        <Tile label="Meals left" value={String(daysLeft * 2)} sub="2 per day" />
        <Tile label="Food cash left" value={naira(remainingAfter(day))} sub="unspent" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-[#FBFAF6] px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
          Avg / meal
        </span>
        <span className="text-[14px] font-extrabold tabular-nums text-ink">
          {naira(PLAN.perMeal)}
        </span>
        <span className="ml-auto text-[10.5px] text-ink-soft">
          {naira(spendLeft)} of food value still to eat
        </span>
      </div>
    </Card>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-2.5">
      <div className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </div>
      <div className="mt-0.5 text-[19px] font-extrabold leading-none tabular-nums text-ink">
        {value}
      </div>
      <div className="text-[9.5px] font-medium text-ink-soft">{sub}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  30-DAY CALENDAR                                                    */
/* ------------------------------------------------------------------ */
export function CalendarCard({
  day,
  setDay,
  onJump,
  scroll = true,
}: {
  day: number;
  setDay: (d: number) => void;
  onJump?: () => void;
  scroll?: boolean;
}) {
  const [filter, setFilter] = useState<Tag | 'ALL'>('ALL');

  const weeks = useMemo(
    () =>
      WEEK_RANGES.map(([a, b], i) => ({
        week: i + 1,
        days: DAYS.filter((d) => d.day >= a && d.day <= b),
        target: weekTarget(i + 1),
      })),
    [],
  );

  return (
    <Card className="p-0">
      <div className="border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink">
              30-day meal calendar
            </h2>
            <p className="text-[10px] font-medium text-ink-soft">
              Tap a day to load it on the dashboard
            </p>
          </div>
          <Pill tone="leaf">{30 - day} days left</Pill>
        </div>

        <div className="no-scrollbar -mx-1 mt-2.5 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'shrink-0 rounded-full border px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider transition',
                filter === f ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-soft',
              )}
            >
              {f === 'ALL' ? 'All' : f === 'FISH' ? 'Fish*' : f}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          'no-scrollbar space-y-3 p-3',
          scroll && 'max-h-[560px] overflow-y-auto lg:max-h-[760px]',
        )}
      >
        {weeks.map((w) => (
          <div key={w.week}>
            <div className="mb-1.5 flex items-center justify-between px-1">
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink">
                Week {w.week}
              </h3>
              <span className="text-[10px] font-medium tabular-nums text-ink-soft">
                Day {pad(w.days[0].day)}–{pad(w.days[w.days.length - 1].day)} • target{' '}
                {naira(w.target)}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
              {w.days.map((d) => {
                const match =
                  filter === 'ALL' ||
                  d.lunch.tags.includes(filter) ||
                  d.dinner.tags.includes(filter);
                const isPast = d.day < day;
                const isToday = d.day === day;
                return (
                  <button
                    key={d.day}
                    onClick={() => {
                      setDay(d.day);
                      onJump?.();
                    }}
                    className={cn(
                      'w-full rounded-xl border bg-white p-3 text-left transition active:scale-[0.995]',
                      isToday ? 'border-leaf ring-1 ring-leaf/20' : 'border-line hover:border-ink/20',
                      !match && 'opacity-30',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-extrabold tracking-wide text-ink">
                          DAY {pad(d.day)}
                        </span>
                        {isToday && <Pill tone="leaf">Today</Pill>}
                        {isPast && <Pill tone="neutral">Done</Pill>}
                      </div>
                      <span className="text-[11.5px] font-extrabold tabular-nums text-ink-soft">
                        {naira(dayCost(d))}
                      </span>
                    </div>

                    <div className="mt-2 space-y-2">
                      {(
                        [
                          ['Lunch', d.lunch],
                          ['Dinner', d.dinner],
                        ] as const
                      ).map(([slot, meal]) => (
                        <div key={slot} className="flex items-start gap-2">
                          <span
                            className={cn(
                              'mt-[3px] w-[42px] shrink-0 text-[8.5px] font-bold uppercase tracking-wider',
                              slot === 'Lunch' ? 'text-amber' : 'text-ink-soft',
                            )}
                          >
                            {slot}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={cn(
                                'text-[12.5px] font-semibold leading-tight',
                                isPast ? 'text-ink-soft/70' : 'text-ink',
                              )}
                            >
                              {meal.name}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {meal.tags.map((t) => (
                                <MealTag key={t} tag={t} small />
                              ))}
                            </div>
                          </div>
                          <span className="shrink-0 text-[10.5px] font-bold tabular-nums text-ink-soft">
                            {naira(mealCost(meal))}
                          </span>
                        </div>
                      ))}
                    </div>

                    {d.batch && (
                      <p className="mt-2 rounded-md bg-leaf-soft px-2 py-1 text-[9.5px] font-medium text-[#1A6B42]">
                        ♻︎ {d.batch}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
