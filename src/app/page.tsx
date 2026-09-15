import { Hero } from "@/components/site/hero";
import { Nav } from "@/components/site/nav";
import { Clients, Marquee } from "@/components/site/clients";
import { Work } from "@/components/site/work";
import { About, Contact, Reel, Services, Testimonials } from "@/components/site/sections";
import { Overlays } from "@/components/site/overlays";
import { LangProvider } from "@/lib/i18n";

export default function Home() {
  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Clients />
        <Work />
        <Reel />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Overlays />
    </LangProvider>
  );
}
