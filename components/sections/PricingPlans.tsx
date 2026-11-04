"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { easings } from "@/lib/easings";
import { pricing } from "@/config/content";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ScrambleGroup } from "@/components/motion/ScrambleGroup";
import { ScrambleText, type ScramblePlay } from "@/components/motion/ScrambleText";

/**
 * Monthly plan cards. Same motion language as IndexedGrid: plan names type in as a scrambled group,
 * hover pops the accent square, slides the name and re-scrambles it.
 */
export function PricingPlans() {
  const [hovered, setHovered] = useState<number | null>(null);
  const plays = useRef<(ScramblePlay | null)[]>([]);

  return (
    <section data-section data-theme="light" className="bg-background pt-32 pb-64 text-foreground lg:pb-128">
      <div className="grid-container">
        <div className="grid-layout mb-32 lg:mb-48">
          <div className="col-span-12 flex items-center justify-between gap-16">
            <div className="flex items-center gap-8">
              <div className="h-12 w-12 bg-brand" />
              <span className="text-accent-sm uppercase">{pricing.kicker}</span>
            </div>
            <span className="section-label">{pricing.label}</span>
          </div>
        </div>
        <ScrambleGroup stagger={0.08} start="top 85%">
          <div className="grid-layout gap-y-16">
            {pricing.plans.map((plan, i) => {
              const isHovered = hovered === i;
              const highlight = !!plan.badge;
              return (
                <div
                  key={plan.name}
                  className={`col-span-12 flex flex-col p-24 md:col-span-4 lg:p-32 ${
                    highlight ? "bg-foreground text-background" : "bg-surface"
                  }`}
                  onMouseEnter={() => {
                    setHovered(i);
                    plays.current[i]?.();
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="relative flex items-center justify-between gap-8">
                    <motion.span
                      aria-hidden="true"
                      className="absolute top-1/2 left-0 -mt-6 hidden size-12 bg-brand lg:block"
                      initial={false}
                      animate={{ rotate: isHovered ? 0 : -90, scale: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: easings.backOut }}
                    />
                    <motion.h3
                      className="text-accent uppercase"
                      animate={{ x: isHovered ? 28 : 0 }}
                      transition={{ duration: 0.5, ease: easings.power3Out }}
                    >
                      <ScrambleText
                        duration={0.5}
                        revealMode
                        onReady={(play) => {
                          plays.current[i] = play;
                        }}
                      >
                        {plan.name}
                      </ScrambleText>
                    </motion.h3>
                    {plan.badge && <span className="bg-brand px-8 py-2 text-accent-sm text-black uppercase">{plan.badge}</span>}
                  </div>
                  <p className="mt-32 flex items-baseline gap-4">
                    <span className="text-h2">{plan.price}</span>
                    <span className={`text-body-sm ${highlight ? "opacity-60" : "text-foreground-muted"}`}>{plan.period}</span>
                  </p>
                  <p className={`mt-8 text-body ${highlight ? "opacity-70" : "text-foreground-muted"}`}>{plan.tagline}</p>
                  <div className={`my-24 h-px w-full ${highlight ? "bg-background/20" : "bg-border"}`} />
                  <ul className="flex flex-1 flex-col gap-8 text-body-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-8">
                        <span className="mt-6 inline-block size-6 shrink-0 bg-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <AnimatedButton
                    href="/contact"
                    size="sm"
                    theme={highlight ? "brand" : "dark"}
                    className="mt-32 w-full"
                  >
                    {`Start with ${plan.name}`}
                  </AnimatedButton>
                </div>
              );
            })}
          </div>
        </ScrambleGroup>

        {/* Packages outside the monthly plans: one-time build and the AI add-on */}
        <div className="grid-layout mt-64 mb-32 lg:mt-96 lg:mb-48">
          <div className="col-span-12 flex items-center justify-between gap-16">
            <div className="flex items-center gap-8">
              <div className="h-12 w-12 bg-brand" />
              <span className="text-accent-sm uppercase">Or go a different way.</span>
            </div>
            <span className="section-label">// Packages</span>
          </div>
        </div>
        <ScrambleGroup stagger={0.08} start="top 85%">
          <div className="grid-layout gap-y-16">
            {pricing.packages.map((pkg, j) => {
              const i = pricing.plans.length + j;
              const isHovered = hovered === i;
              return (
                <div
                  key={pkg.id}
                  className="col-span-12 flex flex-col bg-surface p-24 lg:col-span-6 lg:p-48"
                  onMouseEnter={() => {
                    setHovered(i);
                    plays.current[i]?.();
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="relative flex items-center justify-between gap-8">
                    <motion.span
                      aria-hidden="true"
                      className="absolute top-1/2 left-0 -mt-6 hidden size-12 bg-brand lg:block"
                      initial={false}
                      animate={{ rotate: isHovered ? 0 : -90, scale: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: easings.backOut }}
                    />
                    <motion.h3
                      className="text-accent uppercase"
                      animate={{ x: isHovered ? 28 : 0 }}
                      transition={{ duration: 0.5, ease: easings.power3Out }}
                    >
                      <ScrambleText
                        duration={0.5}
                        revealMode
                        onReady={(play) => {
                          plays.current[i] = play;
                        }}
                      >
                        {pkg.name}
                      </ScrambleText>
                    </motion.h3>
                    <span className="bg-brand px-8 py-2 text-accent-sm text-black uppercase">{pkg.badge}</span>
                  </div>
                  <p className="mt-32 flex flex-wrap items-baseline gap-x-8 gap-y-4">
                    <span className="text-h2">{pkg.price}</span>
                    <span className="text-body-sm text-foreground-muted">{pkg.period}</span>
                  </p>
                  <h4 className="mt-16 text-h4">{pkg.title}</h4>
                  <p className="mt-8 text-body text-foreground-muted lg:max-w-4/5">{pkg.body}</p>
                  <div className="my-32 h-px w-full bg-border" />
                  <div className="grid flex-1 gap-24 md:grid-cols-2">
                    {pkg.groups.map((g) => (
                      <div key={g.label}>
                        <p className="mb-12 text-accent-sm text-foreground-muted uppercase">{g.label}</p>
                        <ul className="flex flex-col gap-8 text-body-sm">
                          {g.items.map((item) => (
                            <li key={item} className="flex items-start gap-8">
                              <span className="mt-6 inline-block size-6 shrink-0 bg-brand" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {pkg.steps.length > 0 && (
                    <div className="mt-32">
                      <p className="mb-12 text-accent-sm text-foreground-muted uppercase">How it works</p>
                      <ol className="grid gap-12 text-body-sm md:grid-cols-3">
                        {pkg.steps.map((step, n) => (
                          <li key={step} className="flex items-start gap-8">
                            <span className="font-mono text-foreground-muted">{String(n + 1).padStart(2, "0")}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <AnimatedButton href="/contact" size="sm" theme="dark" className="mt-32 w-full md:w-auto md:self-start">
                    {pkg.cta}
                  </AnimatedButton>
                </div>
              );
            })}
          </div>
        </ScrambleGroup>
      </div>
    </section>
  );
}
