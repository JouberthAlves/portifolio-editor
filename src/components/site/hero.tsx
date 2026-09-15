"use client";

import { useEffect, useRef, useState } from "react";
import GradualBlur from "@/components/GradualBlur";
import { useLang } from "@/lib/i18n";
import { MOBILE_QUERY, useIsMobile } from "@/lib/use-media";
import { cn } from "@/lib/utils";

const FPS = 24;
const CLIP_SECONDS = 5;
const DESKTOP_VIDEO = "/video/hero.mp4";
// Sequência vertical para celulares: desenhar imagens num canvas é muito mais leve que dar seek em vídeo
const MOBILE_FRAMES = 151;
const mobileFrame = (i: number) => `/video/hero-mobile/f${String(i + 1).padStart(3, "0")}.webp`;

function timecode(seconds: number) {
  const s = Math.floor(seconds);
  const f = Math.floor((seconds - s) * FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `00:00:${pad(s)}:${pad(f)}`;
}

// Ordem de carregamento do grosso para o fino: com poucos quadros já dá para rolar
function loadOrder(total: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < total; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(total - 1)) order.push(total - 1);
  return order;
}

export function Hero() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const fStopRef = useRef<HTMLSpanElement>(null);
  const partsRef = useRef<HTMLUListElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLSpanElement>(null);

  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!section || !video || !canvas) return;

    // Na hidratação o valor ainda é o do servidor; espera o render com o valor real do cliente
    if (window.matchMedia(MOBILE_QUERY).matches !== isMobile) return;
    const mobile = isMobile;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let ticking = false;
    let released = false;
    let disposed = false;
    let lastLine = -1;
    let lastDrawn = -1;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const setLoad = (pct: number) => {
      if (loaderBarRef.current) loaderBarRef.current.style.width = `${Math.round(pct)}%`;
    };

    /* ---------- modo sequência (mobile) ---------- */
    const frames: (HTMLImageElement | null)[] = new Array(MOBILE_FRAMES).fill(null);
    const ctx = mobile ? canvas.getContext("2d") : null;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastDrawn = -1;
      }
    };

    const drawFrame = (index: number) => {
      if (!ctx) return;
      // quadro carregado mais próximo do alvo
      let img: HTMLImageElement | null = null;
      let found = index;
      for (let d = 0; d < MOBILE_FRAMES; d++) {
        if (frames[index - d]) { img = frames[index - d]; found = index - d; break; }
        if (frames[index + d]) { img = frames[index + d]; found = index + d; break; }
      }
      if (!img || found === lastDrawn) return;
      lastDrawn = found;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    /* ---------- HUD sem re-render ---------- */
    const updateHud = (p: number) => {
      if (tcRef.current) tcRef.current.textContent = timecode(p * CLIP_SECONDS);
      if (pctRef.current) pctRef.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (fStopRef.current) fStopRef.current.textContent = `f/${(1.4 + p * 14.6).toFixed(1)}`;
      if (hintRef.current) hintRef.current.style.opacity = released && p < 0.04 ? "1" : "0";
      const parts = partsRef.current?.children;
      if (parts) {
        const active = Math.floor(p * parts.length);
        for (let i = 0; i < parts.length; i++) (parts[i] as HTMLElement).dataset.on = String(p > 0.08 && i <= active);
      }
      const line = p < 0.3 ? 0 : p < 0.68 ? 1 : 2;
      if (line !== lastLine) {
        lastLine = line;
        setLineIndex(line);
      }
    };

    const apply = () => {
      if (mobile) {
        drawFrame(Math.round(target * (MOBILE_FRAMES - 1)));
      } else if (video.duration) {
        video.currentTime = target * video.duration;
      }
      updateHud(target);
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
      timers.push(setTimeout(run, 120));
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      target = Math.min(1, Math.max(0, scrollable > 0 ? -rect.top / scrollable : 0));
      schedule();
    };

    const release = () => {
      if (released || disposed) return;
      released = true;
      setReady(true);
      lastDrawn = -1;
      onScroll();
    };

    const onResize = () => {
      if (mobile) sizeCanvas();
      onScroll();
    };

    const cleanups: (() => void)[] = [];

    if (mobile) {
      sizeCanvas();
      const order = loadOrder(MOBILE_FRAMES);
      const firstPass = Math.ceil(MOBILE_FRAMES / 16) + 1;
      let loaded = 0;
      let cursor = 0;
      // poucas requisições em paralelo para não afogar a rede do celular
      const worker = async () => {
        while (cursor < order.length && !disposed) {
          const i = order[cursor++];
          const img = new Image();
          img.decoding = "async";
          img.src = mobileFrame(i);
          try {
            await img.decode();
          } catch {
            continue;
          }
          if (disposed) return;
          frames[i] = img;
          loaded++;
          if (!released) setLoad((loaded / firstPass) * 100);
          if (loaded === firstPass) release();
          if (released && Math.abs(i - Math.round(target * (MOBILE_FRAMES - 1))) < 3) {
            lastDrawn = -1;
            schedule();
          }
        }
      };
      for (let w = 0; w < (reduced ? 2 : 6); w++) worker();
    } else {
      const onProgress = () => {
        try {
          if (video.buffered.length && video.duration) setLoad((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
        } catch {}
      };
      video.addEventListener("progress", onProgress);
      video.addEventListener("loadedmetadata", onScroll);
      video.addEventListener("canplaythrough", release);
      video.addEventListener("error", release);
      video.src = DESKTOP_VIDEO;
      video.load();
      cleanups.push(() => {
        video.removeEventListener("progress", onProgress);
        video.removeEventListener("loadedmetadata", onScroll);
        video.removeEventListener("canplaythrough", release);
        video.removeEventListener("error", release);
      });
    }

    timers.push(setTimeout(release, 6000));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} id="top" className="relative h-[400vh] md:h-[480vh]" aria-label="Hero">
      <div className="sticky top-0 h-svh overflow-hidden bg-background">
        {/* poster: aparece imediatamente (LCP) e fica por baixo da mídia */}
        <picture>
          <source media={MOBILE_QUERY} srcSet="/video/hero-mobile-poster.webp" />
          <img src="/video/hero-poster.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        </picture>

        <video
          ref={videoRef}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", isMobile && "hidden")}
          style={{ opacity: ready ? 1 : 0 }}
          muted
          playsInline
          preload="none"
          aria-hidden
        />
        <canvas
          ref={canvasRef}
          className={cn("absolute inset-0 h-full w-full transition-opacity duration-700", !isMobile && "hidden")}
          style={{ opacity: ready ? 1 : 0 }}
          aria-hidden
        />

        {/* vinheta para leitura do HUD */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--background)_100%)]" />

        {/* HUD do visor */}
        <div className="pointer-events-none absolute inset-3 top-16 font-mono text-[0.62rem] tracking-[0.2em] text-foreground/80 uppercase sm:inset-8 sm:top-20 md:inset-12 md:top-20 md:text-[0.68rem]">
          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
            <span key={c} className={`absolute size-6 border-[var(--hud-line)] md:size-10 ${c}`} />
          ))}

          <div className="absolute top-3 left-4 flex items-center gap-2 md:top-5 md:left-6">
            <span className="rec-dot size-2 rounded-full bg-rec" />
            <span>Rec</span>
            <span className="ml-3 hidden text-muted-foreground sm:inline">{t.hero.role}</span>
          </div>
          <div className="absolute top-3 right-4 flex gap-3 md:top-5 md:right-6 md:gap-4">
            <span className="hidden sm:inline">4K</span>
            <span>24fps</span>
            <span className="hidden sm:inline">ISO 800</span>
            <span ref={fStopRef}>f/1.4</span>
          </div>

          <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 opacity-40">
            <span className="absolute top-1/2 left-0 h-px w-full bg-foreground" />
            <span className="absolute top-0 left-1/2 h-full w-px bg-foreground" />
          </span>

          <ul ref={partsRef} className="absolute top-1/2 right-4 hidden -translate-y-1/2 space-y-2 text-right md:right-6 lg:block">
            {t.hero.parts.map((part, i) => (
              <li key={part} data-on="false" className="text-muted-foreground opacity-35 transition-all duration-300 data-[on=true]:text-foreground data-[on=true]:opacity-100">
                {String(i + 1).padStart(2, "0")} — {part}
              </li>
            ))}
          </ul>

          <div className="absolute right-4 bottom-3 left-4 flex items-center gap-3 md:right-6 md:bottom-5 md:left-6 md:gap-4">
            <span ref={tcRef} className="tabular-nums">00:00:00:00</span>
            <span className="relative h-px flex-1 overflow-hidden bg-foreground/20">
              <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-rec will-change-transform" />
            </span>
            <span ref={pctRef} className="tabular-nums">000%</span>
          </div>
        </div>

        {/* headline */}
        <div className="absolute inset-x-6 bottom-16 sm:inset-x-10 md:bottom-24 md:left-16">
          <p className="eyebrow mb-3">Caio Vidal</p>
          <div className="relative h-[3.15em] text-[clamp(2rem,9vw,4rem)] sm:h-[2.2em] md:h-[1.1em] md:text-[clamp(1.9rem,6vw,5.5rem)]">
            {t.hero.lines.map((line, i) => (
              <h1
                key={line}
                aria-hidden={i !== lineIndex}
                className="display absolute inset-x-0 bottom-0 max-w-[12ch] pt-[0.18em] leading-[0.98] text-foreground md:leading-[0.88] transition-[opacity,transform,filter] duration-700 ease-[var(--ease-cine)] md:max-w-none"
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

        <div ref={hintRef} className="eyebrow absolute top-28 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-500 md:top-1/2 md:translate-y-[28vh]">
          ↓ {t.hero.scroll}
        </div>

        {/* blur de profundidade só no desktop: backdrop-filter é caro no celular */}
        <div className="hidden md:contents">
          <GradualBlur target="parent" position="bottom" height="5rem" strength={1.5} divCount={5} curve="bezier" zIndex={5} />
        </div>

        {/* loader */}
        <div
          className="absolute inset-0 z-20 grid place-items-center bg-background/85 backdrop-blur-sm transition-opacity duration-700"
          style={{ opacity: ready ? 0 : 1, pointerEvents: ready ? "none" : "auto" }}
          aria-hidden={ready}
        >
          <div className="flex flex-col items-center gap-4 font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            <span className="flex items-center gap-2">
              <span className="rec-dot size-2 rounded-full bg-rec" />
              {t.loader}
            </span>
            <span className="relative h-px w-40 overflow-hidden bg-foreground/15">
              <span ref={loaderBarRef} className="absolute inset-y-0 left-0 w-0 bg-foreground transition-[width] duration-300" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
