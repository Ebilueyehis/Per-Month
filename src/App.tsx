import { useState } from 'react';
import { BottomTabs, SectionHeading, TopBar, useIsDesktop, type Tab } from './components/Shell';
import { BudgetHero, BuyTodayCard, ChecklistCard, TodayCard, WeeklyBoard } from './sections/TodaySections';
import { CalendarCard, PlanSummary } from './sections/PlanSections';
import {
  GarriCard,
  KitchenSetupCard,
  MealRulesCard,
  NoFridgeCard,
  PantryCard,
  ProteinCard,
  RestockCard,
  ForecastNote,
} from './sections/StoreSections';
import { MarketBoardCard, MarketRunsCard, ReserveCard } from './sections/MarketSections';

export default function App() {
  const [day, setDay] = useState(7);
  const [tab, setTab] = useState<Tab>('today');
  const [done, setDone] = useState<Set<string>>(new Set(['1-lunch', '1-dinner']));
  const isDesktop = useIsDesktop();

  const toggle = (k: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const todayProps = { day, setDay, done, toggle };

  return (
    <div className="min-h-screen w-full bg-paper">
      <TopBar day={day} setDay={setDay} tab={tab} setTab={setTab} isDesktop={isDesktop} />

      {/* ================= DESKTOP / TABLET: fluid dashboard ================= */}
      {isDesktop ? (
        <main className="mx-auto max-w-[1680px] space-y-5 px-4 py-5 sm:px-6">
          <BudgetHero day={day} />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)]">
            {/* ---- column 1 : today ---- */}
            <div id="section-today" className="scroll-mt-20 space-y-4">
              <SectionHeading
                eyebrow="Now"
                title="Today’s meals"
                hint={`Day ${String(day).padStart(2, '0')} of 30`}
              />
              <TodayCard {...todayProps} />
              <ChecklistCard day={day} done={done} toggle={toggle} />
              <BuyTodayCard day={day} done={done} toggle={toggle} />
              <ProteinCard day={day} />
            </div>

            {/* ---- column 2 : calendar + weeks ---- */}
            <div id="section-plan" className="scroll-mt-20 space-y-4">
              <SectionHeading eyebrow="Plan" title="30-day calendar" hint="Tap a day to load it" />
              <PlanSummary day={day} />
              <CalendarCard day={day} setDay={setDay} />
            </div>

            {/* ---- column 3 : kitchen ---- */}
            <div id="section-kitchen" className="scroll-mt-20 space-y-4">
              <SectionHeading eyebrow="Stores" title="Kitchen inventory" hint="Not on the ₦40K" />
              <PantryCard day={day} />
              <RestockCard day={day} />
              <KitchenSetupCard />
              <GarriCard day={day} />
              <NoFridgeCard />
            </div>
          </div>

          {/* ---- weekly spending ---- */}
          <div className="space-y-4">
            <SectionHeading eyebrow="Cash flow" title="Weekly spending" />
            <WeeklyBoard day={day} layout="row" />
          </div>

          {/* ---- market ---- */}
          <div id="section-market" className="scroll-mt-20 space-y-4">
            <SectionHeading
              eyebrow="Lagos open market"
              title="Monthly shopping board"
              hint="Estimates — confirm prices before paying"
            />
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <MarketBoardCard day={day} />
              <div className="space-y-4">
                <ReserveCard />
                <MarketRunsCard day={day} setDay={setDay} />
                <MealRulesCard />
              </div>
            </div>
          </div>

          <ForecastNote />
        </main>
      ) : (
        /* ================= MOBILE: fluid single column ================= */
        <main className="mx-auto w-full max-w-[720px] space-y-4 px-3 pb-28 pt-4 sm:px-5">
          {tab === 'today' && (
            <>
              <BudgetHero day={day} />
              <TodayCard {...todayProps} />
              <ChecklistCard day={day} done={done} toggle={toggle} />
              <BuyTodayCard day={day} done={done} toggle={toggle} />
              <PantryCard day={day} />
              <ProteinCard day={day} />
              <SectionHeading eyebrow="Cash flow" title="Weekly spending" />
              <WeeklyBoard day={day} />
              <NoFridgeCard />
            </>
          )}

          {tab === 'plan' && (
            <>
              <PlanSummary day={day} />
              <CalendarCard day={day} setDay={setDay} onJump={() => setTab('today')} scroll={false} />
              <MealRulesCard />
            </>
          )}

          {tab === 'market' && (
            <>
              <MarketBoardCard day={day} />
              <ReserveCard />
              <MarketRunsCard day={day} setDay={setDay} />
            </>
          )}

          {tab === 'kitchen' && (
            <>
              <PantryCard day={day} />
              <RestockCard day={day} />
              <ProteinCard day={day} />
              <KitchenSetupCard />
              <GarriCard day={day} />
              <NoFridgeCard />
            </>
          )}

          <ForecastNote />
        </main>
      )}

      <BottomTabs tab={tab} setTab={setTab} />
    </div>
  );
}
