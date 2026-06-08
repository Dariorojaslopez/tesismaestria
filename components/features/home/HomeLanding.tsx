import { HowItWorksSection } from "./HowItWorksSection";
import { LandingHero } from "./LandingHero";
import { NaturalTreatmentsSection } from "./NaturalTreatmentsSection";
import { CatalogSection } from "./CatalogSection";
import { SiteFooter } from "./SiteFooter";

export function HomeLanding() {
  return (
    <div className="min-h-dvh bg-apple-gray text-apple-headline">
      <LandingHero />
      <HowItWorksSection />
      <NaturalTreatmentsSection />
      <CatalogSection />
      <SiteFooter />
    </div>
  );
}
