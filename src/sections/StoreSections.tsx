import {
  BUDGET,
  PANTRY,
  PANTRY_TOPUPS,
  PLAN,
  PURCHASES,
  itemUseToDate,
  naira,
  pad,
  pantryAt,
} from '../data/plan';
import { Bar, Card, Label, Pill, SectionTitle } from '../components/Primitives';
import { cn } from '../utils/cn';

const fmt = (v: number) => Math.round(v).toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/*  PANTRY INVENTORY                                                   */
/* ------------------------------------------------------------------ */
export function PantryCard({ day }: { day: number }) {
  const pantry = pantryAt(day).map((p) => {
    const daily = day > 0 ? p.used / day : 0;
    const runsOut = Math.round(day + (daily > 0 ? p.left / daily : 999));
    return { ...p, runsOut, safe: runsOut > 30 };
  });

  return (
    <Card>
      <SectionTitle
        title="Already in your kitchen"
        right={
          <span className="text-[10px] font-semibold text-ink-soft">
            Not on the ₦40K • Day {pad(day)}
          </span>
        }
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3">
        {pantry.map((p) => (
          <div key={p.key} className="rounded-xl border border-line bg-white p-2.5">
            <div className="flex items-baseline justify-between gap-1">
              <span className="truncate text-[12px] font-bold leading-tight text-ink">
                {p.label}
              </span>
              <span className="shrink-0 text-[8.5px] font-semibold uppercase tracking-wider text-ink-soft">
                {p.unit}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[19px] font-extrabold leading-none tabular-nums text-ink">
                {fmt(p.left)}
              </span>
              <span className="text-[10px] font-medium text-ink-soft">
                of {fmt(p.owned + p.added)}
              </span>
            </div>
            <div className="mt-1.5">
              <Bar
                pct={p.pct}
                tone={p.pct < 20 ? 'clay' : p.pct < 45 ? 'amber' : 'leaf'}
              />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1">
              <span className="text-[9.5px] font-medium text-ink-soft">
                Used {fmt(p.used)}
              </span>
              {p.safe ? (
                <Pill tone="leaf">Lasts the month</Pill>
              ) : (
                <Pill tone={p.runsOut <= day ? 'clay' : 'amber'}>
                  Out ≈ Day {pad(Math.min(99, p.runsOut))}
                </Pill>
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-col justify-center rounded-xl border border-dashed border-line bg-white/60 p-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            Backup food
          </span>
          <span className="mt-0.5 text-[11px] font-medium leading-snug text-ink">
            Garri is the emergency meal — soak it, or eat it with beans. Never a planned “garri
            mix”.
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  RESTOCK ALERTS                                                     */
/* ------------------------------------------------------------------ */
export function RestockCard({ day }: { day: number }) {
  const upcoming = PANTRY_TOPUPS.filter((t) => t.day > day);
  return (
    <Card>
      <SectionTitle
        title="Restock alerts"
        right={<span className="text-[10px] font-semibold text-ink-soft">Pantry top-ups</span>}
      />
      {upcoming.length === 0 ? (
        <p className="text-[11.5px] text-ink-soft">
          All planned pantry top-ups are already in the kitchen.
        </p>
      ) : (
        <div className="space-y-1.5">
          {upcoming.map((t, i) => {
            const item = PANTRY.find((p) => p.key === t.key)!;
            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-[#F7F6F1] px-2.5 py-2"
              >
                <span className="text-[11.5px] font-medium text-ink">
                  Buy {fmt(t.amount)} {item.unit} of {item.label.toLowerCase()}
                </span>
                <span className="text-[11px] font-bold tabular-nums text-ink-soft">
                  Day {pad(t.day)}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-2 text-[10px] leading-snug text-ink-soft">
        Dry goods are bought twice in the month (Day 1 and Day 15), so one bad market day can’t
        wipe the budget.
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  PROTEIN TRACKER                                                    */
/* ------------------------------------------------------------------ */
export function ProteinCard({ day }: { day: number }) {
  const eggsUsed = itemUseToDate('egg2', day) * 2;
  const eggsBought = PURCHASES.filter((p) => p.day <= day && p.item === 'Eggs').reduce(
    (s, p) => s + p.cost / 200,
    0,
  );
  const nextEggRun = PURCHASES.find((p) => p.item === 'Eggs' && p.day > day)?.day;
  const beansLeft = Math.max(0, PLAN.beans - itemUseToDate('beans', day));
  const crayLeft = Math.max(0, PLAN.cray - itemUseToDate('cray', day));
  const fishLeft = Math.max(0, PLAN.fish - itemUseToDate('fish', day));

  return (
    <Card>
      <SectionTitle
        title="Protein this month"
        right={<span className="text-[10px] font-semibold text-ink-soft">Plan vs used</span>}
      />
      <div className="grid grid-cols-2 gap-2">
        <ProteinTile
          title="Eggs"
          big={String(Math.max(0, PLAN.eggs - eggsUsed))}
          unit="left of 36"
          sub={`${Math.max(0, eggsBought - eggsUsed)} in hand now`}
          pct={((PLAN.eggs - eggsUsed) / PLAN.eggs) * 100}
          note={nextEggRun ? `Next crate: Day ${pad(nextEggRun)}` : 'No more egg buys planned'}
        />
        <ProteinTile
          title="Beans"
          big={String(beansLeft)}
          unit="meals left"
          sub={`${PLAN.beans} planned • ~1 pot a week`}
          pct={(beansLeft / PLAN.beans) * 100}
          note="Small batch, 2 days per pot"
        />
        <ProteinTile
          title="Crayfish"
          big={String(crayLeft)}
          unit="meals left"
          sub={`${PLAN.cray} planned • flavour booster`}
          pct={(crayLeft / PLAN.cray) * 100}
          note="~500 g for the month"
        />
        <div className="rounded-xl border border-dashed border-line bg-[#F4F5F7] p-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-[12px] font-bold text-ink">Fish</span>
            <Pill tone="slate">Outside ₦40K</Pill>
          </div>
          <div className="mt-1 text-[24px] font-extrabold leading-none tabular-nums text-ink">
            {fishLeft}
          </div>
          <div className="text-[9.5px] font-medium text-ink-soft">
            meals left, separate money
          </div>
          <p className="mt-1.5 text-[10px] leading-snug text-ink-soft">
            Fish is allowed but paid for outside the {naira(BUDGET)}. No sardines, no soy chunks.
          </p>
        </div>
      </div>
    </Card>
  );
}

function ProteinTile({
  title,
  big,
  unit,
  sub,
  pct,
  note,
}: {
  title: string;
  big: string;
  unit: string;
  sub: string;
  pct: number;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-2.5">
      <div className="text-[12px] font-bold text-ink">{title}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-[24px] font-extrabold leading-none tabular-nums text-ink">
          {big}
        </span>
        <span className="text-[9.5px] font-semibold uppercase tracking-wider text-ink-soft">
          {unit}
        </span>
      </div>
      <div className="mt-1.5">
        <Bar pct={pct} tone={pct < 25 ? 'clay' : 'leaf'} />
      </div>
      <p className="mt-1.5 text-[10px] leading-snug text-ink-soft">{sub}</p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-leaf">{note}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COOKING SETUP + GARRI + NO-FRIDGE                                  */
/* ------------------------------------------------------------------ */
export function KitchenSetupCard() {
  return (
    <Card>
      <SectionTitle
        title="Cooking setup"
        right={<span className="text-[10px] font-semibold text-ink-soft">Gas • equipment</span>}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-[#F7F6F1] p-2.5">
          <Label>Gas</Label>
          <p className="mt-0.5 text-[11px] leading-snug text-ink">
            Two burns a day maximum — batch beans and soups, reheat instead of recooking. Gas is
            not part of the food budget.
          </p>
        </div>
        <div className="rounded-lg bg-[#F7F6F1] p-2.5">
          <Label>Equipment</Label>
          <p className="mt-0.5 text-[11px] leading-snug text-ink">
            One pot, one frying pan, knife, mortar or blender, covered bowls for leftovers.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function GarriCard({ day }: { day: number }) {
  const garri = pantryAt(day).find((p) => p.key === 'garri')!;
  return (
    <div className="rounded-xl border border-[#E2D9C4] bg-[#FCF6E9] p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#7A5B10]">
          Emergency backup — garri
        </h3>
        <Pill tone="amber">{Math.round(garri.left)} paints left</Pill>
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-[#6B5334]">
        Garri is not a planned meal. Keep it as the backup for a day with no money, no gas or no
        time — soak it, or eat it with beans porridge and soup. Everything else in the plan is
        proper cooked food.
      </p>
    </div>
  );
}

export function NoFridgeCard() {
  const rules = [
    'Buy fresh vegetables in small quantities',
    'Cook small batches — one pot, two meals max',
    'Prefer same-day consumption',
    'Keep dry ingredients uncooked until needed',
    'Don’t rely on reheating to make badly stored food safe',
  ];
  return (
    <Card className="border-[#DCE7DE] bg-[#F2F8F4]">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-leaf text-[12px] font-bold text-white">
          ✓
        </span>
        <h3 className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1A6B42]">
          No-fridge rule
        </h3>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {rules.map((r) => (
          <li key={r} className="flex gap-2 text-[11.5px] leading-snug text-[#2C4034]">
            <span className="mt-[1px] text-leaf">✓</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function MealRulesCard() {
  return (
    <Card>
      <SectionTitle
        title="Meal design rules"
        right={<span className="text-[10px] font-semibold text-ink-soft">The whole plan</span>}
      />
      <ul className="space-y-1.5 text-[11.5px] leading-snug text-ink-soft">
        <li>
          • Rice, garri, spaghetti and macaroni carry the month — <span className="font-semibold text-ink">all already in the kitchen</span>.
        </li>
        <li>• Beans once a week, one pot stretched over two days.</li>
        <li>• Sweet potato regularly — ₦500–₦1,000 a meal and filling.</li>
        <li>• Plantain occasionally — one bunch spread across five meals.</li>
        <li>• Eggs 30–36 for the month, 2 eggs when they appear, never 1 egg every day.</li>
        <li>
          • <span className="font-semibold text-ink">Fish* is never counted inside the ₦40,000.</span>
        </li>
        <li>
          • {naira(PLAN.reserve)} stays protected as an emergency reserve — nothing else touches
          it.
        </li>
      </ul>
    </Card>
  );
}

export function ForecastNote({ tone }: { tone?: string }) {
  return (
    <p
      className={cn(
        'px-1 text-center text-[10px] leading-relaxed text-ink-soft/80',
        tone,
      )}
    >
      All figures are plan estimates derived from the unit prices on the Market board. Confirm
      prices at your own market before buying.
    </p>
  );
}
