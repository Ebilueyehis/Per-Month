import {
  BUDGET,
  DAYS,
  PLAN,
  PURCHASES,
  dayById,
  mealCost,
  naira,
  pad,
  purchasesOn,
  remainingAfter,
  spentToDate,
  weekSpentToDate,
  weekTarget,
  WEEK_NOTE,
  WEEK_RANGES,
} from '../data/plan';
import {
  Bar,
  Card,
  Check,
  DayStepper,
  Label,
  MealTag,
  Pill,
  Ring,
} from '../components/Primitives';
import { cn } from '../utils/cn';

function emojiFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes('plantain')) return '🍌';
  if (n.includes('rice')) return '🍚';
  if (n.includes('spaghetti') || n.includes('macaroni')) return '🍝';
  if (n.includes('yam') || n.includes('potato')) return '🍠';
  if (n.includes('eba')) return '🥣';
  return '🍲';
}

function parseTime(s: string): [number, number] {
  const nums = s.match(/\d+/g);
  if (!nums) return [0, 0];
  const a = Number(nums[0]);
  return [a, nums.length > 1 ? Number(nums[1]) : a];
}

/* ------------------------------------------------------------------ */
/*  BUDGET HERO                                                        */
/* ------------------------------------------------------------------ */
export function BudgetHero({ day }: { day: number }) {
  const spent = spentToDate(day);
  const left = remainingAfter(day);
  const pctLeft = (left / BUDGET) * 100;
  const d = dayById(day);
  const todaySpend = mealCost(d.lunch) + mealCost(d.dinner);

  return (
    <Card className="relative overflow-hidden border-transparent bg-ink p-5 text-white sm:p-7">
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full opacity-[0.18]"
        style={{ background: 'radial-gradient(circle,#7BD1A0 0%,transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-20 h-72 w-72 rounded-full opacity-[0.12]"
        style={{ background: 'radial-gradient(circle,#E0A233 0%,transparent 70%)' }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Monthly food limit
            </span>
            <span className="rounded-full bg-white/10 px-2 py-[2px] text-[9px] font-bold uppercase tracking-wider text-[#EFC86B]">
              Lagos • No fridge
            </span>
          </div>
          <div className="mt-2 text-[40px] font-extrabold leading-none tracking-[-0.03em] tabular-nums sm:text-[54px] lg:text-[62px]">
            {naira(BUDGET)}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[12.5px] font-bold tabular-nums text-[#EFC86B]">
              {naira(left)} remaining
            </span>
            <span className="text-[12px] font-medium text-white/60 tabular-nums">
              {pctLeft.toFixed(0)}% budget remaining
            </span>
          </div>
        </div>

        <Ring pct={pctLeft} className="h-[104px] w-[104px] shrink-0 sm:h-[132px] sm:w-[132px]" stroke={7}>
          <div className="text-center">
            <div className="text-[24px] font-extrabold leading-none tabular-nums sm:text-[30px]">
              {pctLeft.toFixed(0)}%
            </div>
            <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">
              left
            </div>
          </div>
        </Ring>
      </div>

      <div className="relative mt-6">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#37A46C] via-[#D89A2B] to-[#C1522A] transition-all duration-500"
            style={{ width: `${100 - pctLeft}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-white/55 tabular-nums">
          <span>Spent {naira(spent)}</span>
          <span>Day {pad(day)} of 30</span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <HeroStat label="Days left" value={String(30 - day)} sub="of 30" />
        <HeroStat label="Meals left" value={String((30 - day) * 2)} sub="2 per day" />
        <HeroStat label="Today’s food cost" value={naira(todaySpend)} sub="estimate" />
        <HeroStat label="Protected reserve" value={naira(PLAN.reserve)} sub="untouched" gold />
      </div>
    </Card>
  );
}

function HeroStat({
  label,
  value,
  sub,
  gold,
}: {
  label: string;
  value: string;
  sub: string;
  gold?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2">
      <div className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {label}
      </div>
      <div
        className={cn(
          'mt-0.5 text-[17px] font-extrabold leading-none tabular-nums sm:text-[19px]',
          gold ? 'text-[#EFC86B]' : 'text-white',
        )}
      >
        {value}
      </div>
      <div className="text-[9px] font-medium text-white/45">{sub}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TODAY'S MEALS                                                      */
/* ------------------------------------------------------------------ */
export function TodayCard({
  day,
  setDay,
  done,
  toggle,
}: {
  day: number;
  setDay: (d: number) => void;
  done: Set<string>;
  toggle: (k: string) => void;
}) {
  const d = dayById(day);
  const lunchCost = mealCost(d.lunch);
  const dinnerCost = mealCost(d.dinner);
  const [l1, l2] = parseTime(d.lunch.time);
  const [d1, d2] = parseTime(d.dinner.time);

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink">
            Today
          </h2>
          <p className="text-[10px] font-medium text-ink-soft">
            Two meals • cooked once, eaten twice where possible
          </p>
        </div>
        <DayStepper day={day} setDay={setDay} />
      </div>

      <MealRow
        slot="LUNCH"
        emoji={emojiFor(d.lunch.name)}
        meal={d.lunch.name}
        tags={d.lunch.tags}
        cost={lunchCost}
        time={d.lunch.time}
        checked={done.has(`${day}-lunch`)}
        onToggle={() => toggle(`${day}-lunch`)}
      />
      <div className="mx-4 border-t border-dashed border-line" />
      <MealRow
        slot="DINNER"
        emoji={emojiFor(d.dinner.name)}
        meal={d.dinner.name}
        tags={d.dinner.tags}
        cost={dinnerCost}
        time={d.dinner.time}
        checked={done.has(`${day}-dinner`)}
        onToggle={() => toggle(`${day}-dinner`)}
      />

      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line bg-[#FBFAF6] px-4 py-3">
        <div>
          <Label>Today’s estimated spend</Label>
          <div className="mt-0.5 text-[24px] font-extrabold leading-none tabular-nums text-ink">
            {naira(lunchCost + dinnerCost)}
          </div>
        </div>
        <div>
          <Label>Cooking time today</Label>
          <div className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
            {l1 + d1}–{l2 + d2} min
          </div>
        </div>
      </div>

      {d.batch && (
        <p className="flex gap-2 border-t border-line bg-leaf-soft px-4 py-2.5 text-[11px] font-medium leading-snug text-[#1A6B42]">
          <span>♻︎</span>
          <span>{d.batch}</span>
        </p>
      )}
    </Card>
  );
}

function MealRow({
  slot,
  emoji,
  meal,
  tags,
  cost,
  time,
  checked,
  onToggle,
}: {
  slot: string;
  emoji: string;
  meal: string;
  tags: (typeof DAYS)[number]['lunch']['tags'];
  cost: number;
  time: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <button
        onClick={onToggle}
        aria-label={`Mark ${slot} cooked`}
        className={cn(
          'mt-[2px] grid h-5 w-5 shrink-0 place-items-center rounded-[7px] border-2 transition',
          checked ? 'border-leaf bg-leaf text-white' : 'border-[#CFCBC0] bg-white',
        )}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </button>
      <span className="mt-[1px] text-[19px] leading-none">{emoji}</span>
      <div className="min-w-0 flex-1">
        <Label className={cn(checked && 'line-through')}>{slot}</Label>
        <div
          className={cn(
            'mt-0.5 text-[15px] font-bold leading-tight text-ink',
            checked && 'text-ink-soft/70 line-through',
          )}
        >
          {meal}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {tags.map((t) => (
            <MealTag key={t} tag={t} small />
          ))}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[15px] font-extrabold tabular-nums text-ink">{naira(cost)}</div>
        <div className="text-[9.5px] font-medium text-ink-soft">{time}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CHECKLIST                                                          */
/* ------------------------------------------------------------------ */
export function ChecklistCard({
  day,
  done,
  toggle,
}: {
  day: number;
  done: Set<string>;
  toggle: (k: string) => void;
}) {
  const d = dayById(day);
  const buys = purchasesOn(day);
  const buyTotal = buys.reduce((s, p) => s + p.cost, 0);

  let mealsDone = DAYS.filter((x) => x.day < day).length * 2;
  if (done.has(`${day}-lunch`)) mealsDone += 1;
  if (done.has(`${day}-dinner`)) mealsDone += 1;

  return (
    <Card>
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink">
          Checklist
        </h2>
        <span className="text-[10.5px] font-semibold tabular-nums text-ink-soft">
          {mealsDone}/60 meals cooked
        </span>
      </div>
      <div className="space-y-1.5">
        <Check
          checked={done.has(`${day}-lunch`)}
          onClick={() => toggle(`${day}-lunch`)}
          label={`Cook lunch — ${d.lunch.name}`}
          sub={d.lunch.time}
        />
        <Check
          checked={done.has(`${day}-dinner`)}
          onClick={() => toggle(`${day}-dinner`)}
          label={`Cook dinner — ${d.dinner.name}`}
          sub={d.dinner.time}
        />
        {buys.length > 0 ? (
          <Check
            checked={done.has(`${day}-market`)}
            onClick={() => toggle(`${day}-market`)}
            label={`Market run — ${buys.length} item${buys.length > 1 ? 's' : ''}`}
            sub={`${naira(buyTotal)} out of pocket today`}
          />
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-line bg-white/60 px-3 py-2.5 text-[11.5px] font-medium text-ink-soft">
            <span className="text-leaf">✓</span> No market run today — cook from what’s in the
            kitchen.
          </div>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  BUY TODAY                                                          */
/* ------------------------------------------------------------------ */
export function BuyTodayCard({
  day,
  done,
  toggle,
}: {
  day: number;
  done: Set<string>;
  toggle: (k: string) => void;
}) {
  const buys = purchasesOn(day);
  const buyTotal = buys.reduce((s, p) => s + p.cost, 0);
  const nextRun = PURCHASES.find((p) => p.day > day)?.day;

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink">
            Buy today
          </h2>
          <p className="text-[10px] font-medium text-ink-soft">Day {pad(day)} market run</p>
        </div>
        <div className="flex items-center gap-2">
          {buys.length > 0 && (
            <button
              onClick={() => toggle(`${day}-market`)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider transition',
                done.has(`${day}-market`)
                  ? 'border-leaf bg-leaf text-white'
                  : 'border-line bg-white text-ink-soft',
              )}
            >
              {done.has(`${day}-market`) ? 'Bought ✓' : 'Mark bought'}
            </button>
          )}
          <span className="text-[13px] font-extrabold tabular-nums text-ink">
            {naira(buyTotal)}
          </span>
        </div>
      </div>

      {buys.length === 0 ? (
        <div className="px-4 py-6 text-center text-[12px] text-ink-soft">
          Nothing to buy today — eat from the stores.
          {nextRun && (
            <>
              <br />
              <span className="text-[10.5px]">Next market run: Day {pad(nextRun)}</span>
            </>
          )}
        </div>
      ) : (
        <>
          {buys.map((p, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center justify-between px-4 py-2.5',
                i > 0 && 'border-t border-dashed border-line',
                p.outside && 'bg-[#F4F5F7]',
              )}
            >
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-ink">{p.item}</div>
                <div className="text-[10.5px] text-ink-soft">{p.qty}</div>
              </div>
              {p.outside ? (
                <Pill tone="slate">Outside ₦40K</Pill>
              ) : (
                <span className="text-[13px] font-bold tabular-nums text-ink">
                  {naira(p.cost)}
                </span>
              )}
            </div>
          ))}
          <div className="border-t border-line bg-[#FBFAF6] px-4 py-2 text-[10.5px] font-medium text-ink-soft">
            Don’t buy if already available in the kitchen.
          </div>
        </>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  WEEKLY SPENDING                                                    */
/* ------------------------------------------------------------------ */
export function WeeklyBoard({
  day,
  layout = 'stack',
}: {
  day: number;
  layout?: 'stack' | 'row';
}) {
  return (
    <div className={layout === 'row' ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5' : 'space-y-2'}>
      {[1, 2, 3, 4].map((w) => {
        const [a, b] = WEEK_RANGES[w - 1];
        const target = weekTarget(w);
        const toDate = weekSpentToDate(w, day);
        const over = toDate > target;
        const active = day >= a && day <= b;
        return (
          <div
            key={w}
            className={cn(
              'rounded-xl border bg-white p-3',
              active ? 'border-leaf/40 ring-1 ring-leaf/15' : 'border-line',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-ink">
                  Week {w}
                </span>
                <span className="text-[10px] font-medium text-ink-soft">
                  Day {pad(a)}–{pad(b)}
                </span>
              </div>
              <span className="rounded-md bg-[#F3F1EA] px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-wider text-ink-soft">
                {WEEK_NOTE[w]}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <WStat label="Target" value={naira(target)} />
              <WStat label="Spent" value={naira(toDate)} tone={over ? 'clay' : 'ink'} />
              <WStat
                label={over ? 'Over by' : 'Remaining'}
                value={naira(Math.abs(target - toDate))}
                tone={over ? 'clay' : 'leaf'}
              />
            </div>
            <div className="mt-2">
              <Bar pct={(toDate / target) * 100} tone={over ? 'clay' : 'leaf'} />
            </div>
          </div>
        );
      })}

      <div className="rounded-xl border border-dashed border-amber/50 bg-amber-soft p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A5B10]">
            Buffer — protected reserve
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5B10]/70">
            {((PLAN.reserve / BUDGET) * 100).toFixed(1)}% of budget
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-1">
          <span className="text-[26px] font-extrabold tabular-nums text-[#6F4708]">
            {naira(PLAN.reserve)}
          </span>
          <span className="text-[10.5px] font-medium text-[#8A5B10]">
            Unspent • do not touch before Day 24
          </span>
        </div>
        <p className="mt-1 text-[10.5px] leading-snug text-[#8A5B10]/85">
          Kept for price shocks at the market, a gas refill, or a day you must eat out.
        </p>
      </div>
    </div>
  );
}

function WStat({
  label,
  value,
  tone = 'ink',
}: {
  label: string;
  value: string;
  tone?: 'ink' | 'leaf' | 'clay';
}) {
  const tones = { ink: 'text-ink', leaf: 'text-leaf', clay: 'text-clay' };
  return (
    <div>
      <Label>{label}</Label>
      <div className={cn('mt-0.5 text-[14px] font-extrabold tabular-nums', tones[tone])}>
        {value}
      </div>
    </div>
  );
}
