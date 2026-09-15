"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import GlareHover from "@/components/GlareHover";
import BlurText from "@/components/BlurText";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const projects = [
  { slug: "neon", title: "Noite em Neon", client: "Jade Oliveira", type: { pt: "Videoclipe", en: "Music video" }, year: 2026, span: "sm:col-span-2 lg:row-span-2" },
  { slug: "mare", title: "Maré", client: "Maré Surf Co.", type: { pt: "Filme de marca", en: "Brand film" }, year: 2025, span: "" },
  { slug: "cafe", title: "Origem", client: "Café Origem", type: { pt: "Publicidade", en: "Commercial" }, year: 2025, span: "" },
  { slug: "rota", title: "Rota 040", client: "Rota 040", type: { pt: "Publicidade", en: "Commercial" }, year: 2025, span: "" },
  { slug: "silencio", title: "Silêncio", client: "Norte Filmes", type: { pt: "Curta-metragem", en: "Short film" }, year: 2024, span: "" },
  { slug: "casa", title: "Casa Aberta", client: "Casa Aberta", type: { pt: "Documentário", en: "Documentary" }, year: 2024, span: "" },
  { slug: "pulso", title: "Largada", client: "PULSO", type: { pt: "Campanha", en: "Campaign" }, year: 2024, span: "lg:col-span-2" },
  { slug: "sertao", title: "Ecos do Sertão", client: "Selo Grave", type: { pt: "Documentário", en: "Documentary" }, year: 2023, span: "sm:col-span-2 lg:col-span-1" },
];
// Grade sem buracos em todos os tamanhos:
// 2 colunas (tablet): 2 | 1+1 | 1+1 | 1+1 | 2
// 3 colunas (desktop): 2x2 + 2 | 1+1+1 | 2+1

export function Work() {
  const { t, lang } = useLang();

  return (
    <section id="work" className="scroll-mt-16 py-16 md:py-24 lg:py-32" aria-labelledby="work-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">{t.work.eyebrow}</p>
            <h2 id="work-title" className="display text-[clamp(2.75rem,8vw,7rem)]">
              <BlurText key={lang} text={t.work.title} animateBy="words" delay={90} direction="top" className="-mt-[0.18em] flex flex-wrap [&>span]:pt-[0.18em]" />
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground tabular-nums">[ {String(projects.length).padStart(2, "0")} ] 2023 — 2026</p>
        </div>

        <ul className="grid auto-rows-[15rem] grid-cols-1 gap-3 sm:auto-rows-[17rem] sm:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-3">
          {projects.map((p, i) => (
            <li key={p.slug} className={cn("min-h-0", p.span)}>
              <GlareHover
                width="100%"
                height="100%"
                background="var(--card)"
                borderRadius="var(--radius)"
                borderColor="var(--border)"
                glareColor="#ffffff"
                glareOpacity={0.22}
                glareAngle={-35}
                glareSize={260}
                transitionDuration={900}
                className="cursor-target group !cursor-none"
              >
                <a href="#contact" className="absolute inset-0 block" aria-label={`${t.work.view}: ${p.title}`}>
                  <Image
                    src={`/images/projects/${p.slug}.webp`}
                    alt={`${p.title} — ${p.type[lang]}`}
                    fill
                    sizes="(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-cine)] group-hover:scale-[1.04]"
                    priority={i === 0}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                  <span className="absolute inset-x-3 top-3 flex items-center gap-2">
                    <span className="font-mono text-[0.65rem] tracking-[0.2em] text-foreground/70">{String(i + 1).padStart(2, "0")}</span>
                    <Badge variant="outline" className="border-foreground/25 bg-background/40 font-mono text-[0.6rem] tracking-[0.15em] uppercase backdrop-blur-sm">
                      {p.type[lang]}
                    </Badge>
                    <span className="ml-auto hidden size-9 items-center justify-center rounded-full border border-foreground/30 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100 md:flex">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </span>
                  <span className="absolute inset-x-4 bottom-4 min-w-0">
                    <span className="display block text-[clamp(1.75rem,7vw,2.25rem)] text-balance lg:text-4xl">{p.title}</span>
                    <span className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                      {p.client}
                      <span className="size-1 rounded-full bg-muted-foreground/60" aria-hidden />
                      <span className="font-mono text-xs">{p.year}</span>
                    </span>
                  </span>
                </a>
              </GlareHover>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
