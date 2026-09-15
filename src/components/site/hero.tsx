"use client";

import { useEffect, useRef, useState } from "react";
import GradualBlur from "@/components/GradualBlur";
import { useLang } from "@/lib/i18n";

const FPS = 24;

// Timecode no formato HH:MM:SS:FF, dirigido pelo progresso do scroll
function timecode(seconds: number) {
  const total = Math.max(0, seconds);
  const s = Math.floor(total);
  const f = Math.floor((total - s) * FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `00:00:${pad(s)}:${pad(f)}`;
}

export function Hero() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let duration = video.readyState >= 1 && video.duration ? video.duration : 0;
    let target = 0;
    let ticking = false;
    let released = false;

    const apply = () => {
      if (duration) video.currentTime = target * duration;
      setProgress(target);
    };

    // rAF + fallback por timeout: o flag nunca fica travado
    const schedule = () => {
      if (document.hidden) return apply();
      if (ticking) return;
      ticking = true;
      let done = false;
      const run = () => {
        if (done) return;
        done = true;
        ticking = false;
        apply();
      };
      requestAnimationFrame(run);
      setTimeout(run, 120);
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? -rect.top / scrollable : 0;
      target = Math.min(1, Math.max(0, p));
      schedule();
    };

    const release = () => {
      if (released) return;
      released = true;
      duration = video.duration || duration;
      setReady(true);
      onScroll();
    };

    const onMeta = () => {
      duration = video.duration;
      onScroll();
    };
    const onProgress = () => {
      try {
        if (video.buffered.length && video.duration) {
          setLoadPct(Math.round((video.buffered.end(video.buffered.length - 1) / video.duration) * 100));
        }
      } catch {}
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", release);
    video.addEventListener("error", release);
    if (video.readyState >= 4) release();
    const fallback = setTimeout(release, 6000);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      clearTimeout(fallback);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", release);
      video.removeEventListener("error", release);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lineIndex = progress < 0.3 ? 0 : progress < 0.68 ? 1 : 2;
  const partIndex = Math.min(t.hero.parts.length - 1, Math.floor(progress * t.hero.parts.length));
  const fStop = (1.4 + progress * 14.6).toFixed(1);

  return (
    <section ref={sectionRef} id="top" className="relative h-[480vh]" aria-label="Hero">
      <div className="sticky top-0 h-svh overflow-hidden bg-background">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
          src="/video/hero.mp4"
          poster="/video/hero-poster.webp"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />

        {/* vinheta para leitura do HUD */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--background)_100%)]" />

        {/* HUD do visor */}
        <div className="pointer-events-none absolute inset-4 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-foreground/80 sm:inset-8 md:inset-12">
          {/* cantos */}
          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
            <span key={c} className={`absolute size-6 border-[var(--hud-line)] md:size-10 ${c}`} />
          ))}

          <div className="absolute top-3 left-4 flex items-center gap-2 md:top-5 md:left-6">
            <span className="rec-dot size-2 rounded-full bg-rec" />
            <span>Rec</span>
            <span className="ml-3 hidden text-muted-foreground sm:inline">{t.hero.role}</span>
          </div>
          <div className="absolute top-3 right-4 flex gap-4 md:top-5 md:right-6">
            <span className="hidden sm:inline">4K</span>
            <span>24fps</span>
            <span className="hidden sm:inline">ISO 800</span>
            <span>f/{fStop}</span>
          </div>

          {/* mira central */}
          <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 opacity-40">
            <span className="absolute top-1/2 left-0 h-px w-full bg-foreground" />
            <span className="absolute top-0 left-1/2 h-full w-px bg-foreground" />
          </span>

          {/* lista de componentes internos */}
          <ul className="absolute top-1/2 right-4 hidden -translate-y-1/2 space-y-2 text-right md:right-6 lg:block">
            {t.hero.parts.map((part, i) => (
              <li
                key={part}
                className="transition-colors duration-300"
                style={{ color: progress > 0.08 && i <= partIndex ? "var(--foreground)" : "var(--muted-foreground)", opacity: progress > 0.08 && i <= partIndex ? 1 : 0.35 }}
              >
                {String(i + 1).padStart(2, "0")} — {part}
              </li>
            ))}
          </ul>

          <div className="absolute right-4 bottom-3 left-4 flex items-center gap-4 md:right-6 md:bottom-5 md:left-6">
            <span className="tabular-nums">{timecode(progress * 5)}</span>
            <span className="relative h-px flex-1 bg-foreground/20">
              <span className="absolute inset-y-0 left-0 bg-rec" style={{ width: `${progress * 100}%` }} />
            </span>
            <span className="tabular-nums">{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
          </div>
        </div>

        {/* headline */}
        <div className="absolute inset-x-6 bottom-20 sm:inset-x-10 md:bottom-24 md:left-16">
          <p className="eyebrow mb-3">Caio Vidal</p>
          <div className="relative h-[2.1em] text-[clamp(1.9rem,6vw,5.5rem)] md:h-[1.1em]">
            {t.hero.lines.map((line, i) => (
              <h1
                key={line}
                aria-hidden={i !== lineIndex}
                className="display absolute inset-x-0 bottom-0 max-w-[14ch] text-foreground transition-all duration-700 ease-[var(--ease-cine)] md:max-w-none"
                style={{
                  opacity: i === lineIndex ? 1 : 0,
                  filter: i === lineIndex ? "blur(0px)" : "blur(12px)",
                  transform: `translateY(${i === lineIndex ? 0 : i < lineIndex ? -24 : 24}px)`,
                }}
              >
                {line}
              </h1>
            ))}
          </div>
        </div>

        <div
          className="eyebrow absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[28vh] transition-opacity duration-500"
          style={{ opacity: ready && progress < 0.04 ? 1 : 0 }}
        >
          ↓ {t.hero.scroll}
        </div>

        <GradualBlur target="parent" position="bottom" height="5rem" strength={1.5} divCount={5} curve="bezier" zIndex={5} />

        {/* loader */}
        <div
          className="absolute inset-0 z-20 grid place-items-center bg-background transition-opacity duration-700"
          style={{ opacity: ready ? 0 : 1, pointerEvents: ready ? "none" : "auto" }}
          aria-hidden={ready}
        >
          <div className="flex flex-col items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="rec-dot size-2 rounded-full bg-rec" />
              {t.loader}
            </span>
            <span className="relative h-px w-40 bg-foreground/15">
              <span className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-300" style={{ width: `${loadPct}%` }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
