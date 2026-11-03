import { notFound } from "next/navigation";
import { genericPages } from "@/config/content";
import { HeroTextOnly } from "@/components/sections/HeroTextOnly";

export function generateStaticParams() {
  return Object.keys(genericPages).map((slug) => ({ slug }));
}
export const dynamicParams = false;

// PLACEHOLDER pages for menu destinations (Services / About / Contact).
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = genericPages[slug];
  if (!page) notFound();
  return (
    <section data-section data-theme="light" className="flex min-h-svh items-center bg-background py-160 text-foreground">
      <HeroTextOnly headline={page.headline} subtext={page.subtext} className="w-full" />
    </section>
  );
}
