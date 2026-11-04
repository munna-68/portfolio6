import type { Metadata } from "next";
import { brand, contactPage, socials } from "@/config/content";
import { HeroTextOnly } from "@/components/sections/HeroTextOnly";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us how you take orders today. Email SiteKeep and we'll show you what a custom system for it looks like.",
};

export default function ContactPage() {
  return (
    <>
      <section data-section data-theme="light" className="flex min-h-svh flex-col justify-center bg-background py-160 text-foreground">
        <HeroTextOnly headline={contactPage.headline} subtext={contactPage.subtext} className="w-full" />
        <div className="grid-container mt-64">
          <div className="flex flex-col items-center gap-16 text-center">
            <AnimatedLink href={`mailto:${brand.email}`} className="text-h4 [overflow-wrap:anywhere]">
              {brand.email}
            </AnimatedLink>
            <div className="flex flex-wrap items-center justify-center gap-24">
              {socials.map((s) => (
                <AnimatedLink key={s.name} href={s.href} external className="text-accent">
                  {s.name}
                </AnimatedLink>
              ))}
            </div>
            <p className="text-accent-sm text-foreground-muted uppercase">Based in Bangladesh · Working with US small businesses</p>
          </div>
        </div>
      </section>
      <Faq />
    </>
  );
}
