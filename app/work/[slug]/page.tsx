import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/config/content";
import { HeroTextOnly } from "@/components/sections/HeroTextOnly";
import { IndexedGrid } from "@/components/sections/IndexedGrid";
import { Media } from "@/components/ui/Media";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-accent-sm text-foreground-muted uppercase">{label}</span>
      <span className="text-body">{children}</span>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <section data-section data-theme="dark" className="bg-background pt-160 pb-64 text-foreground lg:pt-192 lg:pb-96">
        <HeroTextOnly headline={project.title} subtext={project.summary} className="mb-64" />
        <div className="grid-container">
          <Media slot={project.slot} priority className="aspect-[16/10] w-full lg:aspect-[16/9]" />
          <div className="grid-layout mt-32 gap-y-24 lg:mt-48">
            <div className="col-span-6 lg:col-span-2">
              <Fact label="Type">{project.kind === "Client" ? "Client project" : "Concept build"}</Fact>
            </div>
            <div className="col-span-6 lg:col-span-2">
              <Fact label="Year">{project.year}</Fact>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <Fact label="Stack">{project.stack.join(", ")}</Fact>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:justify-self-end">
              {project.liveUrl && (
                <Fact label={project.kind === "Client" ? "Live site" : "Demo"}>
                  <AnimatedLink href={project.liveUrl} external indicator className="text-accent">
                    {project.liveLabel ?? project.liveUrl}
                  </AnimatedLink>
                </Fact>
              )}
            </div>
          </div>
        </div>
      </section>

      <section data-section data-theme="light" className="bg-background py-64 text-foreground lg:py-128">
        <div className="grid-container">
          <div className="grid-layout gap-y-48">
            <div className="col-span-12 lg:col-span-4">
              <span className="section-label">// The problem</span>
              <p className="mt-24 text-body-lg">{project.problem}</p>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <span className="section-label">// What we built</span>
              <ul className="mt-24 flex flex-col">
                {project.built.map((b) => (
                  <li key={b} className="flex items-start gap-12 border-b border-border py-16 text-body">
                    <span className="mt-8 inline-block size-8 shrink-0 bg-brand" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-32 text-body text-foreground-muted">{project.result}</p>
            </div>
          </div>
        </div>
      </section>

      {project.gallery && (
        <section data-section data-theme="dark" className="bg-background py-64 text-foreground lg:py-128">
          <div className="grid-container">
            <div className="grid-layout gap-y-48">
              {project.gallery.map((img, i) => (
                <figure key={img.src} className="col-span-12 md:col-span-6">
                  <Media image={img} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/10]" imgClassName="zoom-in-image" />
                  <figcaption className="mt-16 flex items-start gap-16">
                    <span className="text-accent-sm text-foreground-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex flex-col gap-4">
                      <span className="text-accent uppercase">{img.title}</span>
                      <span className="text-body-sm text-foreground-muted">{img.caption}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <IndexedGrid
        data={{
          headline: "Want one like this?",
          label: "// Your business",
          kicker: "Custom builds from $19.99 a month.",
          items: [
            { title: "Tell us how you work.", text: "How orders and bookings come in today, and what goes wrong." },
            { title: "See a working demo.", text: "Built around your niche, before you commit to anything." },
            { title: "We keep it running.", text: "Hosting, fixes and small updates, one low monthly fee." },
          ],
        }}
      />

      <section data-section data-theme="dark" className="bg-background py-64 text-foreground lg:py-96">
        <div className="grid-container flex flex-col items-start justify-between gap-32 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-8">
            <span className="text-accent-sm text-foreground-muted uppercase">Next project</span>
            <AnimatedLink href={`/work/${next.slug}`} indicator className="text-h3">
              {next.title}
            </AnimatedLink>
          </div>
          <AnimatedButton href="/contact" size="sm" theme="brand">
            Start a project
          </AnimatedButton>
        </div>
      </section>
    </>
  );
}
