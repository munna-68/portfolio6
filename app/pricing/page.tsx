import type { Metadata } from "next";
import { pricing } from "@/config/content";
import { HeroTextOnly } from "@/components/sections/HeroTextOnly";
import { PricingPlans } from "@/components/sections/PricingPlans";
import { IndexedGrid } from "@/components/sections/IndexedGrid";
import { Faq } from "@/components/sections/Faq";
import { ContactCta } from "@/components/sections/ContactCta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Custom websites and booking systems from $19.99/month, with hosting and updates included. Or a $750 one-time build.",
};

export default function PricingPage() {
  return (
    <>
      <section data-section data-theme="light" className="bg-background pt-160 pb-32 text-foreground lg:pt-192">
        <HeroTextOnly headline={pricing.headline} subtext={pricing.subtext} />
      </section>
      <PricingPlans />
      <IndexedGrid data={pricing.extras} theme="dark" />
      <Faq headline="Pricing questions" items={pricing.faq} theme="light" />
      <ContactCta />
    </>
  );
}
