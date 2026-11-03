import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { IndexedGrid } from "@/components/sections/IndexedGrid";
import { Faq } from "@/components/sections/Faq";
import { ContactCta } from "@/components/sections/ContactCta";

// Section order and themes follow the reference landing page.
export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <HowWeWork />
      <SelectedWork />
      <IndexedGrid />
      <Faq />
      <ContactCta />
    </>
  );
}
