# Caio Vidal — Portfólio de editor de vídeo

Portfólio fictício (PT/EN) com hero cinematográfico: uma câmera de cinema que se desmonta conforme o scroll.

## Stack

- Next.js 16 (App Router) + Tailwind CSS 4
- shadcn/ui (button, badge, card, sheet, avatar, separator)
- React Bits: Noise, TargetCursor, LogoLoop, BlurText, DecryptedText, CountUp, GradualBlur, LightRays, ScrollVelocity, GlareHover, SpotlightCard

## Hero em scroll

`public/video/hero.mp4` é um vídeo de 5s, 60fps, 1920px, **com todos os quadros como keyframe**
(necessário para `video.currentTime` acompanhar o scroll sem travar). Para regenerar a partir de um vídeo bruto:

```bash
ffmpeg -y -i raw.mp4 -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmc=1:me_mode=bidir:search_param=32" -c:v libx264 -crf 16 -an interp.mp4
ffmpeg -y -i interp.mp4 -vf "scale=1920:-2:flags=lanczos" -c:v libx264 -x264-params keyint=1:min-keyint=1:scenecut=0 -g 1 -crf 18 -preset slow -pix_fmt yuv420p -movflags +faststart -an public/video/hero.mp4
```

A lógica de binding fica em `src/components/site/hero.tsx`. Textos PT/EN em `src/lib/i18n.tsx`.

## Rodando

```bash
npm install
npm run dev
```
