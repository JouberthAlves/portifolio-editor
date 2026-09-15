"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Clapperboard, Mail, MessageCircle, Palette, Play, Sparkles, Volume2 } from "lucide-react";
import BlurText from "@/components/BlurText";
import CircularText from "@/components/CircularText";
import CountUp from "@/components/CountUp";
import DecryptedText from "@/components/DecryptedText";
import SpotlightCard from "@/components/SpotlightCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/site/nav";
import { useLang } from "@/lib/i18n";
import { useIsMobile } from "@/lib/use-media";

const LightRays = dynamic(() => import("@/components/LightRays"), { ssr: false });

const EMAIL = "contato@caiovidal.com";
const WHATSAPP = "https://wa.me/5511999999999";

function SectionHead({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  const { lang } = useLang();
  return (
    <div className="mb-12 md:mb-16">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 id={id} className="display text-[clamp(2.5rem,7vw,6rem)]">
        <BlurText key={lang} text={title} animateBy="words" delay={80} direction="top" className="-mt-[0.18em] flex flex-wrap [&>span]:pt-[0.18em]" />
      </h2>
    </div>
  );
}

export function Reel() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-28 lg:py-36" aria-labelledby="reel-title">
      {/* feixe de projetor */}
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        {isMobile ? (
          <div className="absolute inset-x-0 top-0 h-3/4 bg-[radial-gradient(ellipse_50%_70%_at_50%_0%,rgb(236_235_230/0.16),transparent_70%)]" />
        ) : (
          <LightRays raysOrigin="top-center" raysColor="#ecebe6" raysSpeed={0.6} lightSpread={0.7} rayLength={1.6} fadeDistance={1.1} noiseAmount={0.12} distortion={0.04} followMouse mouseInfluence={0.05} />
        )}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-4">{t.reel.eyebrow}</p>
          <h2 id="reel-title" className="display text-[clamp(2.25rem,6vw,5rem)]">
            {t.reel.title}
          </h2>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-2xl shadow-black">
          <video
            ref={videoRef}
            src="/video/hero.mp4"
            poster="/images/projects/neon.webp"
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            controls={playing}
            preload="none"
          />
          {!playing && (
            <button
              type="button"
              onClick={play}
              className="cursor-target group absolute inset-0 grid place-items-center bg-background/40 transition-colors hover:bg-background/20"
              aria-label={t.reel.play}
            >
              <span className="flex flex-col items-center gap-4">
                <span className="grid size-20 place-items-center rounded-full border border-foreground/40 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 md:size-24">
                  <Play className="size-7 translate-x-0.5 fill-foreground" />
                </span>
                <span className="eyebrow text-foreground">{t.reel.play}</span>
              </span>
            </button>
          )}
          <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase">
            <span className="rec-dot size-1.5 rounded-full bg-rec" /> Reel_2026_v12_FINAL.mov
          </span>
        </div>
        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">{t.reel.note}</p>
      </div>
    </section>
  );
}

export function About() {
  const { t } = useLang();
  const stats = [
    { to: 180, suffix: "+" },
    { to: 9, suffix: "" },
    { to: 60, suffix: "+" },
    { to: 40, suffix: "" },
  ];

  return (
    <section id="about" className="scroll-mt-16 border-t border-border py-16 md:py-24 lg:py-32" aria-labelledby="about-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[var(--radius)] border border-border lg:max-w-none">
          <Image src="/images/people/caio-vidal.webp" alt="Caio Vidal em sua ilha de edição" fill sizes="(min-width: 1024px) 40vw, 448px" className="object-cover" />
          <span className="absolute inset-3 border border-[var(--hud-line)] opacity-50" aria-hidden />
          <span className="absolute bottom-5 left-5 font-mono text-[0.65rem] tracking-[0.2em] uppercase">CV — São Paulo, BR</span>
        </div>

        <div className="flex flex-col justify-center">
          <SectionHead eyebrow={t.about.eyebrow} title={t.about.title} id="about-title" />
          <div className="max-w-[60ch] space-y-5 text-lg leading-relaxed text-muted-foreground">
            {t.about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={t.about.stats[i]} className="bg-background p-5">
                <dt className="font-mono text-[0.62rem] tracking-[0.15em] text-muted-foreground uppercase">{t.about.stats[i]}</dt>
                <dd className="display mt-2 text-5xl">
                  <CountUp to={s.to} duration={1.6} />
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const { t } = useLang();
  const icons = [Clapperboard, Palette, Sparkles, Volume2];

  return (
    <section id="services" className="scroll-mt-16 border-t border-border py-16 md:py-24 lg:py-32" aria-labelledby="services-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead eyebrow={t.services.eyebrow} title={t.services.title} id="services-title" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.services.items.map((s, i) => {
            const Icon = icons[i];
            return (
              <SpotlightCard key={s.t} spotlightColor="rgba(255, 59, 48, 0.14)" className="cursor-target !rounded-[var(--radius)] !border-border !bg-card !p-6">
                <div className="flex h-full flex-col">
                  <div className="mb-10 flex items-center justify-between">
                    <Icon className="size-6 text-rec" strokeWidth={1.5} />
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="display mb-3 text-3xl">{s.t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* processo como uma timeline de edição */}
        <div className="mt-20">
          <p className="eyebrow mb-6">{t.services.process.eyebrow}</p>
          <ol className="relative grid gap-6 sm:grid-cols-5 sm:gap-0">
            <span className="absolute top-[0.3rem] right-0 left-0 hidden h-px bg-border sm:block" aria-hidden />
            {t.services.process.steps.map((step, i) => (
              <li key={step} className="relative flex items-center gap-4 sm:block">
                <span className="relative z-10 block size-2.5 shrink-0 rounded-full border border-foreground/60 bg-background sm:mb-5" aria-hidden />
                <span>
                  <span className="block font-mono text-[0.65rem] text-muted-foreground tabular-nums">00:0{i}:00:00</span>
                  <span className="display mt-1 block text-2xl md:text-3xl">{step}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t } = useLang();
  return (
    <section className="border-t border-border py-16 md:py-24 lg:py-32" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} id="testimonials-title" />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {t.testimonials.items.map((item, i) => (
            <Card key={item.n} className="justify-between rounded-[var(--radius)] border border-border bg-card py-6 ring-0">
              <CardContent className="px-6">
                <span className="display block text-6xl leading-none text-rec" aria-hidden>
                  “
                </span>
                <blockquote className="mt-2 text-lg leading-relaxed text-foreground/90">{item.q}</blockquote>
              </CardContent>
              <CardFooter className="gap-3 border-t border-border px-6 pt-5">
                <Avatar className="size-11">
                  <AvatarImage src={`/images/people/testimonial-${i + 1}.webp`} alt={item.n} />
                  <AvatarFallback>{item.n.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.n}</p>
                  <p className="text-xs text-muted-foreground">{item.r}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function useSaoPauloClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

function SlateCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 p-4">
      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">{label}</span>
      <span className="display truncate text-2xl leading-none md:text-3xl">{value}</span>
    </div>
  );
}

// Claquete com os dados da "próxima cena" — composta sobre o Card do shadcn
function Slate() {
  const { t, lang } = useLang();
  const s = t.contact.slate;
  const now = useSaoPauloClock();
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const date = now ? now.toLocaleDateString(locale, { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric" }) : "--/--/----";
  const time = now ? now.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour12: false }) : "--:--:--";

  return (
    <div className="relative w-full max-w-md lg:ml-auto">
      {/* selo giratório */}
      <div className="absolute -top-24 -right-2 z-10 hidden size-36 place-items-center sm:grid md:-right-10">
        <CircularText text={t.contact.badge.toUpperCase()} spinDuration={18} onHover="speedUp" className="!size-36 font-mono text-[0.62rem] tracking-[0.1em] text-foreground" />
        <span className="absolute grid size-14 place-items-center rounded-full border border-foreground/30 bg-background">
          <span className="rec-dot size-3 rounded-full bg-rec" />
        </span>
      </div>

      {/* bastão da claquete */}
      <div
        className="h-10 origin-bottom-left -rotate-3 sm:-rotate-6 rounded-t-[var(--radius)] border border-b-0 border-border transition-transform duration-500 ease-[var(--ease-cine)] group-hover/slate:rotate-0"
        style={{ background: "repeating-linear-gradient(-45deg, var(--foreground) 0 22px, var(--background) 22px 44px)" }}
        aria-hidden
      />
      <div
        className="h-6 border border-y-0 border-border"
        style={{ background: "repeating-linear-gradient(45deg, var(--foreground) 0 22px, var(--background) 22px 44px)" }}
        aria-hidden
      />

      <Card className="gap-0 rounded-t-none rounded-b-[var(--radius)] border border-border bg-card py-0 ring-0">
        <CardContent className="px-0">
          <div className="border-b border-border">
            <SlateCell label={s.prod} value={s.prodValue} />
          </div>
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            <SlateCell label={s.director} value={s.directorValue} />
            <SlateCell label={s.editor} value="Caio Vidal" />
          </div>
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            <SlateCell label={s.roll} value="A001" />
            <SlateCell label={s.scene} value="01" />
            <SlateCell label={s.take} value="01" />
          </div>
          <div className="grid grid-cols-2 divide-x divide-border">
            <SlateCell label={s.date} value={<span className="font-mono text-lg tabular-nums md:text-xl">{date}</span>} />
            <SlateCell label={s.time} value={<span className="font-mono text-lg tabular-nums md:text-xl">{time}</span>} />
          </div>
        </CardContent>
        <CardFooter className="gap-2 rounded-b-[var(--radius)] border-t border-border bg-card px-4 py-3 font-mono text-[0.68rem] tracking-[0.15em] uppercase">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-live/60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-live" />
          </span>
          {s.status}
        </CardFooter>
      </Card>
    </div>
  );
}

export function Contact() {
  const { t } = useLang();
  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden border-t border-border pt-16 md:pt-28 lg:pt-36" aria-labelledby="contact-title">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="eyebrow mb-6">{t.contact.eyebrow}</p>
          <h2 id="contact-title" className="display text-[clamp(4rem,15vw,11.5rem)]">
            <span className="block">{t.contact.title[0]}</span>
            <span className="flex items-center gap-[0.15em]">
              {t.contact.title[1]}
              <span className="rec-dot inline-block size-[0.18em] rounded-full bg-rec" aria-hidden />
            </span>
          </h2>

          <p className="mt-10 mb-4 max-w-md text-lg text-muted-foreground">{t.contact.body}</p>
          <a href={`mailto:${EMAIL}`} className="cursor-target font-mono text-xl md:text-3xl">
            <DecryptedText text={EMAIL} animateOn="inViewHover" speed={40} maxIterations={14} sequential revealDirection="start" encryptedClassName="text-muted-foreground" />
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="cursor-target h-12 bg-rec px-6 text-foreground hover:bg-rec/85">
              <a href={`mailto:${EMAIL}`}>
                <Mail /> {t.contact.email} <ArrowUpRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="cursor-target h-12 px-6">
              <a href={WHATSAPP} target="_blank" rel="noreferrer">
                <MessageCircle /> {t.contact.whatsapp}
              </a>
            </Button>
          </div>
        </div>

        <div className="group/slate cursor-target pt-10 lg:pt-0">
          <Slate />
        </div>
      </div>

      <footer className="mx-auto mt-24 max-w-7xl px-4 pb-10 sm:px-8">
        <Separator className="mb-8" />
        <div className="flex flex-col gap-6 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <Logo className="text-foreground" />
          <div className="flex gap-6 uppercase tracking-[0.15em]">
            <a href="#" className="cursor-target hover:text-foreground">Instagram</a>
            <a href="#" className="cursor-target hover:text-foreground">Vimeo</a>
            <a href="#" className="cursor-target hover:text-foreground">LinkedIn</a>
          </div>
          <p>
            © {new Date().getFullYear()} Caio Vidal. {t.footer.rights} <span className="block md:inline">{t.footer.made}</span>
          </p>
        </div>
      </footer>
    </section>
  );
}
