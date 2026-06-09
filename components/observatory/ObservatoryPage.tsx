"use client";

import { SiteFooter } from "@/components/features/home/SiteFooter";
import { ObservatoryDashboard } from "./ObservatoryDashboard";
import { ObservatoryHero } from "./ObservatoryHero";
import { ObservatoryWizard } from "./ObservatoryWizard";
import { useObservatoryAnalytics } from "./useObservatoryAnalytics";

export function ObservatoryPage() {
  const { data, loading, refresh } = useObservatoryAnalytics();

  return (
    <main className="min-h-dvh bg-apple-gray pb-24 text-[#1d1d1f]">
      <ObservatoryHero analytics={data} loading={loading} />
      <ObservatoryDashboard analytics={data} loading={loading} />
      <section
        id="participa"
        className="border-t border-black/[0.06] bg-white px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <ObservatoryWizard onSurveyComplete={() => void refresh()} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
