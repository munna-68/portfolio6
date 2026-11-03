import { notFound } from "next/navigation";
import { projects } from "@/config/content";
import { HeroTextOnly } from "@/components/sections/HeroTextOnly";
import { Media } from "@/components/ui/Media";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// PLACEHOLDER case-study page so project links have a transition destination.
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <section data-section data-theme="dark" className="min-h-svh bg-background pt-160 pb-128 text-foreground lg:pt-192">
      <HeroTextOnly headline={project.title} subtext={project.tags.join(" — ")} className="mb-64" />
      <div className="grid-container">
        <Media slot={project.slot} priority className="aspect-[16/9] w-full" />
      </div>
    </section>
  );
}
