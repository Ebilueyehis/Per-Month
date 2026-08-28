import {
  BUDGET,
  PLAN,
  PURCHASES,
  naira,
  pad,
  remainingAfter,
  spentToDate,
} from '../data/plan';
import { Card, Pill, SectionTitle } from '../components/Primitives';
import { cn } from '../utils/cn';

type Row = { item: string; target: string; cost: number; bought: number };

function boardRows(day: number): Row[] {
  const boughtFor = (key: string) =>
    PURCHASES.filter((p) => p.board === key && p.day <= day).reduce((s, p) => s + p.cost, 0);

  const mk = (item: string, target: string, cost: number, board: string): Row => ({
    item,
    target,
    cost,
    bought: boughtFor(board),
  });

  return [
    mk('Eggs', '30–36 eggs', PLAN.board.eggs, 'eggs'),
    mk('Beans', '2 paints', PLAN.board.beans, 'beans'),
    mk('Sweet potatoes', '6 meals', PLAN.board.sp, 'sp'),
    mk('Plantain', '1 bunch', PLAN.board.plantain, 'plantain'),
    mk('Vegetables', 'small purchases', PLAN.board.veg, 'veg'),
    mk('Crayfish', '~500 g', PLAN.board.cray, 'cray'),
    mk('Yam', '2 meals', PLAN.board.yam, 'yam'),
    mk('Palm oil', '~2 L', PLAN.board.palmoil, 'palmoil'),
    mk('Vegetable oil', '~750 ml', PLAN.board.vegoil, 'vegoil'),
    mk('Onions & pepper', 'periodic', PLAN.board.onions, 'onions'),
    mk('Seasoning & salt', 'restock', PLAN.board.seasoning, 'seasoning'),
    mk('Rice top-up', '½ paint', PLAN.board.rice, 'rice'),
    mk('Dry pepper top-up', '~4 sachets', PLAN.board.pepper, 'pepper'),
    mk('Market transport', 'misc', PLAN.board.misc, 'misc'),
  ];
}

/* ------------------------------------------------------------------ */
/*  SHOPPING BOARD                                                     */
/* ------------------------------------------------------------------ */
export function MarketBoardCard({ day }: { day: number }) {
  const rows = boardRows(day);
  const total = rows.reduce((s, r) => s + r.cost, 0);
  const boughtTotal = rows.reduce((s, r) => s + r.bought, 0);

  return (
    <Card dark className="board-grid relative overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-[13px]">
            Monthly shopping board
          </h2>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/45">
            Lagos open market • estimates • Day {pad(day)} status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-white/10 px-2.5 py-1.5 text-right">
            <div className="text-[8px] font-bold uppercase tracking-wider text-white/45">
              Bought
            </div>
            <div className="text-[12px] font-extrabold tabular-nums text-[#EFC86B]">
              {naira(boughtTotal)} / {naira(total)}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_0.5fr] gap-2 border-b border-white/15 py-2 text-[8.5px] font-bold uppercase tracking-[0.12em] text-white/45 sm:text-[9px]">
          <span>Item</span>
          <span>Target</span>
          <span className="text-right">Est. cost</span>
          <span className="text-right">Bought</span>
        </div>

        {rows.map((r, i) => {
          const full = r.bought >= r.cost;
          const partial = r.bought > 0 && !full;
          return (
            <div
              key={r.item}
              className={cn(
                'grid grid-cols-[1.4fr_1fr_1fr_0.5fr] items-center gap-2 py-2 text-[11px] sm:text-[12px]',
                i > 0 && 'border-t border-dashed border-white/12',
              )}
            >
              <span className="truncate font-semibold text-white/90">{r.item}</span>
              <span className="truncate text-[10px] text-white/55 sm:text-[11px]">{r.target}</span>
              <span className="text-right font-bold tabular-nums text-[#EFC86B]">
                {naira(r.cost)}
              </span>
              <span className="text-right text-[11px]">
                {full ? (
                  <span className="font-bold text-[#6FD79C]">✓</span>
                ) : partial ? (
                  <span className="font-bold text-[#EFC86B]">◐</span>
                ) : (
                  <span className="text-white/30">—</span>
                )}
              </span>
            </div>
          );
        })}

        <div className="grid grid-cols-[1.4fr_1fr_1fr_0.5fr] items-center gap-2 border-t border-dashed border-white/25 py-2 text-[11px] sm:text-[12px]">
          <span className="truncate font-semibold text-[#9FB6A8]">Fish*</span>
          <span className="truncate text-[10px] text-[#9FB6A8]/70 sm:text-[11px]">
            {PLAN.fish} meals
          </span>
          <span className="text-right text-[9px] font-bold uppercase tracking-wide text-[#9FB6A8]">
            Outside ₦40K
          </span>
          <span className="text-right text-white/30">—</span>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 bg-black/25 px-4 py-3 sm:px-5">
        <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
          Planned spend — board total
        </span>
        <span className="text-[18px] font-extrabold tabular-nums text-white">{naira(total)}</span>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  RESERVE                                                            */
/* ------------------------------------------------------------------ */
export function ReserveCard() {
  return (
    <div className="rounded-xl border-2 border-dashed border-amber/60 bg-amber-soft p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#8A5B10]">
          Protected emergency reserve
        </span>
        <Pill tone="amber">Do not spend</Pill>
      </div>
      <div className="mt-1.5 text-[32px] font-extrabold leading-none tabular-nums text-[#6F4708]">
        {naira(PLAN.reserve)}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-[#8A5B10]">
        {naira(BUDGET)} limit − {naira(PLAN.plannedSpend)} planned spend. It stays in your account
        for market price shocks, a gas refill, or a day you must eat out.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MARKET RUNS                                                        */
/* ------------------------------------------------------------------ */
export function MarketRunsCard({
  day,
  setDay,
}: {
  day: number;
  setDay: (d: number) => void;
}) {
  const runs = Array.from(new Set(PURCHASES.map((p) => p.day))).sort((a, b) => a - b);

  return (
    <Card>
      <SectionTitle
        title="Market runs"
        right={<span className="text-[10px] font-semibold text-ink-soft">Tap to jump</span>}
      />
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
        {runs.map((rd) => {
          const items = PURCHASES.filter((p) => p.day === rd);
          const cash = items.reduce((s, p) => s + (p.outside ? 0 : p.cost), 0);
          const isToday = rd === day;
          const past = rd <= day;
          return (
            <button
              key={rd}
              onClick={() => setDay(rd)}
              className={cn(
                'w-full rounded-xl border bg-white p-2.5 text-left transition active:scale-[0.995]',
                isToday ? 'border-leaf ring-1 ring-leaf/20' : 'border-line hover:border-ink/20',
                !past && 'opacity-70',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-9 place-items-center rounded-md bg-ink text-[9px] font-extrabold text-white">
                    D{pad(rd)}
                  </span>
                  <span className="text-[11px] font-bold text-ink">
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </span>
                  {isToday && <Pill tone="leaf">Today</Pill>}
                  {past && !isToday && <Pill tone="neutral">Bought</Pill>}
                </div>
                <span className="text-[12.5px] font-extrabold tabular-nums text-ink">
                  {naira(cash)}
                </span>
              </div>
              <p className="mt-1 truncate text-[10.5px] text-ink-soft">
                {items.map((p) => p.item).join(' • ')}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] leading-snug text-ink-soft">
        Spent to date: {naira(spentToDate(day))} of {naira(BUDGET)} • cash left{' '}
        {naira(remainingAfter(day))}. Fish rows are paid with separate money and never enter the
        budget.
      </p>
    </Card>
  );
}
