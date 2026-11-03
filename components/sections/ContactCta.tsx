"use client";

import { contactCta } from "@/config/content";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Media } from "@/components/ui/Media";

/** "Start a project." section: block-wipe headings, 16:9 photo, contact links. */
export function ContactCta() {
  return (
    <section data-section data-theme="light" className="bg-background pt-64 pb-64 text-foreground lg:pt-128 lg:pb-128">
      <div className="grid-container">
        <div className="grid-layout gap-y-48">
          <div className="col-span-12 lg:col-span-6">
            <div className="flex h-full flex-col items-start justify-start gap-80">
              <AnimatedHeadline as="h2" trigger="scroll">
                {contactCta.headline}
              </AnimatedHeadline>
              <Media slot={contactCta.slot} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/9] w-full" />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-8">
            <div className="flex h-full flex-col items-start justify-between gap-16">
              <AnimatedHeadline as="h4" trigger="scroll">
                {contactCta.subheadline}
              </AnimatedHeadline>
              <div className="flex flex-col gap-16 text-body">
                <p>
                  {contactCta.body[0]}
                  <br />
                  {contactCta.body[1]}
                </p>
              </div>
              <div className="flex flex-col items-start gap-16">
                <AnimatedLink href={contactCta.link.href} className="text-body">
                  {contactCta.link.label}
                </AnimatedLink>
                <AnimatedLink href={contactCta.secondary.href} indicator className="text-accent">
                  {contactCta.secondary.label}
                </AnimatedLink>
                <p className="text-accent-sm text-foreground-muted">{contactCta.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
