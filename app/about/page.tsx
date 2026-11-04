import type { Metadata } from "next";
import { about } from "@/config/content";
import { HeroTextOnly } from "@/components/sections/HeroTextOnly";
import { IndexedGrid } from "@/components/sections/IndexedGrid";
import { Stats } from "@/components/sections/Stats";
import { ContactCta } from "@/components/sections/ContactCta";
import { Media } from "@/components/ui/Media";

export const metadata: Metadata = {
  title: "About",
  description: "SiteKeep is a two-person studio: Mahmud builds, Tamanna designs. Custom systems for US small businesses.",
};

export default function AboutPage() {
  return (
    <>
      <section data-section data-theme="light" className="bg-background pt-160 pb-64 text-foreground lg:pt-192 lg:pb-96">
        <HeroTextOnly headline={about.headline} subtext={about.subtext} className="mb-64 lg:mb-96" />
        <div className="grid-container">
          <div className="grid-layout">
            <div className="col-span-12 lg:col-span-10 lg:col-start-2">
              <Media slot="about-system" priority sizes="(min-width: 1024px) 83vw, 100vw" className="aspect-[16/9] w-full" />
            </div>
          </div>
        </div>
      </section>
      <IndexedGrid data={{ headline: "Who we are.", label: about.label, kicker: about.kicker, items: about.people }} />
      <Stats />
      <IndexedGrid
        data={{ headline: about.beliefsHeadline, label: about.beliefsLabel, kicker: about.beliefsKicker, items: about.beliefs }}
      />
      <ContactCta />
    </>
  );
}
