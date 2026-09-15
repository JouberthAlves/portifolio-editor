"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type Lang = "pt" | "en";

const dict = {
  pt: {
    nav: { work: "Trabalhos", about: "Sobre", services: "Serviços", contact: "Contato", cta: "Orçamento" },
    loader: "Calibrando lente",
    hero: {
      lines: ["Cada corte conta uma história.", "Eu desmonto cada imagem…", "…e remonto como emoção."],
      role: "Editor de vídeo & colorista",
      scroll: "Role para desmontar",
      parts: ["Lente", "Sensor", "Processador", "Refrigeração", "Bateria"],
    },
    marquee: ["Edição", "Color grading", "Motion design", "Sound design", "Finalização"],
    clients: { eyebrow: "Quem confia", title: "Marcas e produtoras que já passaram pela minha timeline" },
    work: {
      eyebrow: "Trabalhos selecionados",
      title: "Frames que viraram histórias",
      view: "Ver projeto",
    },
    reel: { eyebrow: "Showreel 2026", title: "Dois minutos. Nove anos de corte.", play: "Assistir reel", note: "Prévia — o reel completo chega em breve." },
    about: {
      eyebrow: "Sobre",
      title: "Oi, eu sou o Caio.",
      body: [
        "Há nove anos transformo horas de material bruto em minutos que as pessoas não conseguem parar de assistir. Comecei cortando videoclipes de amigos em São Paulo e hoje edito campanhas, documentários e filmes de marca para clientes no Brasil e fora dele.",
        "Meu trabalho é invisível quando bem feito: ritmo, respiro, cor e som no lugar certo — para que o público só sinta.",
      ],
      stats: ["Projetos entregues", "Anos de estrada", "Clientes", "Views somadas (mi)"],
    },
    services: {
      eyebrow: "Serviços",
      title: "Do bruto ao master",
      items: [
        { t: "Edição & montagem", d: "Narrativa, ritmo e estrutura para publicidade, documentário, videoclipe e conteúdo." },
        { t: "Color grading", d: "Look cinematográfico consistente, do log ao delivery, em DaVinci Resolve." },
        { t: "Motion design", d: "Títulos, lettering animado e gráficos que respiram junto com o corte." },
        { t: "Sound design & mix", d: "Trilha, efeitos e mixagem para a imagem soar tão bem quanto parece." },
      ],
      process: { eyebrow: "Processo", steps: ["Briefing", "Decupagem", "Primeiro corte", "Cor & som", "Entrega"] },
    },
    testimonials: {
      eyebrow: "Depoimentos",
      title: "O que dizem depois do render",
      items: [
        { q: "O Caio entendeu a campanha antes de nós mesmos. Entregou três versões e todas eram melhores que o roteiro.", n: "Marina Albuquerque", r: "Diretora de marketing, Maré Surf Co." },
        { q: "Ritmo impecável e zero drama com prazo. Virou o primeiro nome que ligamos quando o projeto é grande.", n: "Ricardo Menezes", r: "Produtor executivo, Norte Filmes" },
        { q: "Ele fez meu clipe parecer um filme. A cor, os cortes no beat… meu público notou na hora.", n: "Jade Oliveira", r: "Cantora e compositora" },
      ],
    },
    contact: {
      eyebrow: "Contato",
      title: ["Vamos", "rodar?"],
      body: "Conte sobre o seu projeto. Respondo em até 24 horas.",
      email: "Enviar e-mail",
      whatsapp: "WhatsApp",
      badge: "Disponível para novos projetos • 2026 • ",
      slate: {
        prod: "Produção",
        prodValue: "Seu próximo projeto",
        director: "Direção",
        directorValue: "Você",
        editor: "Montagem",
        scene: "Cena",
        take: "Take",
        roll: "Rolo",
        date: "Data",
        time: "Hora (SP)",
        status: "Agenda aberta para out — dez",
      },
    },
    footer: { rights: "Todos os direitos reservados.", made: "Portfólio fictício para demonstração." },
  },
  en: {
    nav: { work: "Work", about: "About", services: "Services", contact: "Contact", cta: "Get a quote" },
    loader: "Calibrating lens",
    hero: {
      lines: ["Every cut tells a story.", "I take every image apart…", "…and rebuild it as emotion."],
      role: "Video editor & colorist",
      scroll: "Scroll to disassemble",
      parts: ["Lens", "Sensor", "Processor", "Cooling", "Battery"],
    },
    marquee: ["Editing", "Color grading", "Motion design", "Sound design", "Finishing"],
    clients: { eyebrow: "Trusted by", title: "Brands and studios that have been through my timeline" },
    work: {
      eyebrow: "Selected work",
      title: "Frames that became stories",
      view: "View project",
    },
    reel: { eyebrow: "Showreel 2026", title: "Two minutes. Nine years of cutting.", play: "Watch reel", note: "Preview — full reel coming soon." },
    about: {
      eyebrow: "About",
      title: "Hi, I'm Caio.",
      body: [
        "For nine years I've been turning hours of raw footage into minutes people can't stop watching. I started cutting friends' music videos in São Paulo and now edit campaigns, documentaries and brand films for clients in Brazil and abroad.",
        "When done right, my work is invisible: rhythm, breathing room, color and sound in the right place — so the audience just feels it.",
      ],
      stats: ["Projects delivered", "Years in the game", "Clients", "Combined views (M)"],
    },
    services: {
      eyebrow: "Services",
      title: "From raw to master",
      items: [
        { t: "Editing & assembly", d: "Narrative, pacing and structure for ads, documentaries, music videos and content." },
        { t: "Color grading", d: "A consistent cinematic look, from log to delivery, in DaVinci Resolve." },
        { t: "Motion design", d: "Titles, animated lettering and graphics that breathe with the cut." },
        { t: "Sound design & mix", d: "Score, effects and mixing so the picture sounds as good as it looks." },
      ],
      process: { eyebrow: "Process", steps: ["Briefing", "Logging", "First cut", "Color & sound", "Delivery"] },
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What they say after the render",
      items: [
        { q: "Caio understood the campaign before we did. He delivered three versions and every one beat the script.", n: "Marina Albuquerque", r: "Marketing director, Maré Surf Co." },
        { q: "Flawless pacing and zero deadline drama. He's now the first name we call when a project is big.", n: "Ricardo Menezes", r: "Executive producer, Norte Filmes" },
        { q: "He made my music video feel like a film. The color, the cuts on the beat… my audience noticed right away.", n: "Jade Oliveira", r: "Singer-songwriter" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: ["Ready to", "roll?"],
      body: "Tell me about your project. I reply within 24 hours.",
      email: "Send an email",
      whatsapp: "WhatsApp",
      badge: "Available for new projects • 2026 • ",
      slate: {
        prod: "Production",
        prodValue: "Your next project",
        director: "Director",
        directorValue: "You",
        editor: "Editor",
        scene: "Scene",
        take: "Take",
        roll: "Roll",
        date: "Date",
        time: "Time (SP)",
        status: "Booking Oct — Dec",
      },
    },
    footer: { rights: "All rights reserved.", made: "Fictional portfolio for demo purposes." },
  },
};

export type Dict = (typeof dict)["pt"];

const LangContext = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({
  lang: "pt",
  t: dict.pt,
  setLang: () => {},
});

// Idioma guardado fora do React: lido do localStorage/navegador no cliente, "pt" no servidor
const listeners = new Set<() => void>();
let current: Lang | null = null;

function readLang(): Lang {
  if (current) return current;
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "pt") return (current = saved);
  } catch {}
  return (current = navigator.language && !navigator.language.startsWith("pt") ? "en" : "pt");
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "pt" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    current = l;
    try {
      localStorage.setItem("lang", l);
    } catch {}
    listeners.forEach((cb) => cb());
  };

  return <LangContext.Provider value={{ lang, t: dict[lang] as Dict, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
