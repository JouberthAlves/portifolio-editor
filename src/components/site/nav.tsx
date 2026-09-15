"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetClose, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useLang, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("cursor-target flex items-center gap-2 font-display text-xl tracking-wide uppercase", className)}>
      Vidal
      <span className="rec-dot size-2 rounded-full bg-rec" aria-hidden />
    </a>
  );
}

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-sm border border-border p-0.5 font-mono text-[0.65rem] uppercase" role="group" aria-label="Idioma / Language">
      {(["pt", "en"] as Lang[]).map((l) => (
        <Button
          key={l}
          size="xs"
          variant={lang === l ? "secondary" : "ghost"}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className="cursor-target rounded-[2px] px-2 font-mono uppercase"
        >
          {l}
        </Button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#work", label: t.nav.work },
    { href: "#about", label: t.nav.about },
    { href: "#services", label: t.nav.services },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "border-b border-border bg-background/70 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((l) => (
            <Button key={l.href} asChild variant="ghost" size="sm" className="cursor-target font-mono text-[0.7rem] tracking-[0.18em] uppercase">
              <a href={l.href}>{l.label}</a>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LangToggle />
          <Button asChild size="sm" className="cursor-target bg-rec text-foreground hover:bg-rec/85">
            <a href="#contact">{t.nav.cta}</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <SheetTitle className="px-6 pt-6">
                <Logo />
              </SheetTitle>
              <Separator />
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {links.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <a href={l.href} className="display py-2 text-4xl">
                      {l.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto p-6">
                <SheetClose asChild>
                  <Button asChild className="w-full bg-rec text-foreground hover:bg-rec/85">
                    <a href="#contact">{t.nav.cta}</a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
