import { workPage } from "@/config/content";
import { HeroTextOnly } from "@/components/sections/HeroTextOnly";
import { WorkGrid } from "@/components/sections/WorkGrid";

export default function WorkPage() {
  return (
    <section data-section data-theme="light" className="min-h-svh bg-background pt-160 pb-128 text-foreground lg:pt-192">
      <HeroTextOnly headline={workPage.headline} subtext={workPage.subtext} className="mb-64 lg:mb-96" />
      <WorkGrid />
    </section>
  );
}
