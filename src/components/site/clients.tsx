"use client";

import { Aperture, AudioLines, Clapperboard, Coffee, Film, Mountain, Radio, Sparkles, Waves, Zap } from "lucide-react";
import LogoLoop, { type LogoItem } from "@/components/LogoLoop";
import ScrollVelocity from "@/components/ScrollVelocity";
import { useLang } from "@/lib/i18n";

// Clientes fictícios: wordmarks em texto + ícone, cada um com uma "voz" tipográfica
const clients = [
  { name: "Norte Filmes", icon: Clapperboard, cls: "font-display uppercase tracking-wider" },
  { name: "Maré Surf Co.", icon: Waves, cls: "font-sans font-semibold italic" },
  { name: "PULSO", icon: Zap, cls: "font-display tracking-[0.25em]" },
  { name: "Café Origem", icon: Coffee, cls: "font-sans font-light tracking-wide" },
  { name: "Lumen Records", icon: AudioLines, cls: "font-mono uppercase tracking-widest" },
  { name: "Rota 040", icon: Mountain, cls: "font-display uppercase" },
  { name: "Estúdio Âmbar", icon: Aperture, cls: "font-sans font-medium" },
  { name: "Casa Aberta", icon: Sparkles, cls: "font-sans font-bold uppercase tracking-tight" },
  { name: "Rádio Vértice", icon: Radio, cls: "font-mono lowercase" },
  { name: "Selo Grave", icon: Film, cls: "font-display uppercase tracking-[0.15em]" },
];

export function Marquee() {
  const { t } = useLang();
  const line = t.marquee.map((m) => `${m} ●`).join(" ");
  return (
    <div className="border-y border-border py-6 select-none" aria-hidden>
      <ScrollVelocity
        texts={[line]}
        velocity={60}
        className="display px-4 py-[0.18em] text-5xl text-foreground/90 md:text-7xl"
        numCopies={4}
      />
    </div>
  );
}

export function Clients() {
  const { t } = useLang();

  const logos: LogoItem[] = clients.map((c) => {
    const Icon = c.icon;
    return {
      title: c.name,
      ariaLabel: c.name,
      node: (
        <span className={`flex items-center gap-3 text-2xl whitespace-nowrap text-foreground/55 transition-colors hover:text-foreground md:text-3xl ${c.cls}`}>
          <Icon className="size-6 md:size-7" strokeWidth={1.5} />
          {c.name}
        </span>
      ),
    };
  });

  return (
    <section className="py-24 md:py-32" aria-labelledby="clients-title">
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-8">
        <p className="eyebrow mb-3">{t.clients.eyebrow}</p>
        <h2 id="clients-title" className="max-w-xl text-lg text-muted-foreground md:text-xl">
          {t.clients.title}
        </h2>
      </div>
      <LogoLoop
        logos={logos}
        speed={70}
        direction="left"
        logoHeight={36}
        gap={72}
        pauseOnHover
        fadeOut
        fadeOutColor="var(--background)"
        scaleOnHover
        ariaLabel={t.clients.eyebrow}
      />
    </section>
  );
}
