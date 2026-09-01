import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import heroImage03 from "../../Tatto/Tatto image03.jpg";
import heroImage08 from "../../Tatto/Tatto image08.jpg";
import heroImage34 from "../../Tatto/Tatto image34.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tattoon — Blackwork & Oldschool Tattoo Expert" },
      {
        name: "description",
        content:
          "Blackwork and oldschool tattoo studio. Custom tattoo design, cover ups and piercing. Book your appointment today.",
      },
      { property: "og:title", content: "Tattoon — Blackwork & Oldschool Tattoo Expert" },
      {
        property: "og:description",
        content:
          "Blackwork and oldschool tattoo studio. Custom tattoo design, cover ups and piercing. Book your appointment today.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2">
      <img src="/tatto/Tatto%20image02.svg" alt="TATTOON Logo" className="h-7 w-auto object-contain" />
    </a>
  );
}

const services = [
  { title: "Tattoo design", offset: "md:mt-0", icon: "/tatto/Tatto%20image15.svg" },
  { title: "Tattooing", offset: "md:mt-8", icon: "/tatto/Tatto%20image16.svg" },
  { title: "Piercing", offset: "md:mt-0", icon: "/tatto/Tatto%20image17.svg" },
  { title: "Cover ups", offset: "md:mt-8", icon: "/tatto/Tatto%20image18.svg" },
];

const testimonials = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    name: "Sabrina Lecompte",
    role: "Influencer",
  },
  {
    quote:
      "Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    name: "Marcus Doyle",
    role: "Musician",
  },
];

const HERO_IMAGES = [heroImage03, heroImage08, heroImage34];

function Index() {
  const [t, setT] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  // Initialize randomly on mount and change every 2 seconds (2000ms)
  useEffect(() => {
    // Pick any of the hero images randomly at start
    const initialIndex = Math.floor(Math.random() * HERO_IMAGES.length);
    setHeroIndex(initialIndex);

    // Switch image every 2 seconds (2000ms)
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const current = testimonials[t]!;

  return (
    <div id="top" className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      {/* HERO */}
      <section className="relative min-h-[100svh] border-b border-border/20 overflow-hidden">
        <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col lg:grid lg:grid-cols-2">
          {/* Left Column */}
          <div className="relative z-10 flex flex-col justify-between px-6 py-6 sm:px-10 md:px-12 lg:py-8">
            <header className="flex items-center justify-between">
              <Logo />
              <nav className="flex items-center gap-6 font-display text-xs tracking-widest text-muted-foreground uppercase">
                <Link to="/" className="text-foreground transition-colors hover:text-gold">Home</Link>
                <Link to="/dashboard" className="transition-colors hover:text-gold">Dashboard</Link>
              </nav>
            </header>

            <div className="my-auto max-w-lg py-12 sm:py-16 lg:py-20">
              <span className="inline-block mb-4 border border-gold/40 bg-gold/10 px-3 py-1 font-display text-[0.7rem] tracking-[0.2em] text-gold uppercase">
                Premium Tattoo Studio
              </span>
              <h1 className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl tracking-tight">
                Blackwork &<br />
                Oldschool <span className="text-gold">Expert</span>
              </h1>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
                eros elementum tristique.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-5 sm:gap-6">
                <a href="#contact" className="link-cta text-sm">
                  Make an appointment
                </a>
                <a href="#portfolio" className="link-cta text-sm">
                  My work
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4">
              <span className="tracking-widest uppercase text-[0.7rem]">Est. 2018</span>
              <span className="h-3 w-px bg-border" />
              <span className="tracking-widest uppercase text-[0.7rem]">Custom Tattoo Art</span>
            </div>
          </div>

          {/* Right Column (Hero Images Rotator) */}
          <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-full overflow-hidden">
            {HERO_IMAGES.map((imgSrc, idx) => (
              <img
                key={idx}
                src={imgSrc}
                alt={`Tattoo Artwork ${idx + 1}`}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out ${
                  heroIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                loading="eager"
              />
            ))}
            {/* Gradient overlays */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-background/90 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-background/60 lg:via-transparent lg:to-transparent" />
            
            <span className="absolute right-6 top-6 z-30 hidden text-gold lg:block">
              <ArrowUpRight size={18} />
            </span>

            {/* Interactive Image Indicators for Image 03, 08, 34 */}
            <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-background/70 backdrop-blur-md px-3.5 py-1.5 border border-border/60">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Select Tattoo image ${i + 1}`}
                  onClick={() => setHeroIndex(i)}
                  className={`h-1.5 transition-all duration-300 cursor-pointer ${
                    heroIndex === i ? "w-6 bg-gold" : "w-2 bg-foreground/30 hover:bg-foreground/60"
                  }`}
                />
              ))}
              <span className="ml-2 font-display text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                0{heroIndex + 1} / 03
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 py-20 sm:py-28 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-2xl font-bold tracking-wide sm:text-3xl">
            My <span className="text-gold">Services</span>
          </h2>
          <div className="mx-auto mt-12 sm:mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <article
                key={s.title}
                className={`group border border-border bg-ink-2/40 p-6 sm:p-7 transition-all duration-300 hover:border-gold hover:bg-ink-2/70 ${s.offset}`}
              >
                <div className="flex h-11 w-11 items-center justify-center border border-border/80 bg-ink/70 p-2 transition-all duration-300 group-hover:border-gold group-hover:scale-105">
                  <img src={s.icon} alt={s.title} className="h-6 w-6 object-contain" />
                </div>
                <h3 className="mt-8 font-display text-sm font-semibold sm:text-base">{s.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section id="portfolio" className="px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-6">
            <div className="group relative aspect-square overflow-hidden border border-border/40 col-span-1">
              <img
                src="/tatto/Tatto%20image43.jpeg"
                alt="Tattoo artwork square 1"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="group relative aspect-square overflow-hidden border border-border/40 col-span-2">
              <img
                src="/tatto/Tatto%20image39.jpg"
                alt="Tattoo featured artwork"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="group relative aspect-square overflow-hidden border border-border/40 col-span-1">
              <img
                src="/tatto/Tatto%20image42.jpeg"
                alt="Tattoo artwork square 2"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="group relative aspect-square overflow-hidden border border-border/40 col-span-1">
              <img
                src="/tatto/Tatto%20image10.jpg"
                alt="Tattoo artwork portrait 1"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="group relative aspect-square overflow-hidden border border-border/40 col-span-1">
              <img
                src="/tatto/Tatto%20image14.jpg"
                alt="Tattoo artwork portrait 2"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {[
              { src: "/tatto/Tatto%20image23.jpeg", alt: "Tattoo piece 1" },
              { src: "/tatto/Tatto%20image33.jpeg", alt: "Tattoo piece 2" },
              { src: "/tatto/Tatto%20image38.jpeg", alt: "Tattoo piece 3" },
              { src: "/tatto/Tatto%20image21.jpg", alt: "Tattoo piece 4" },
            ].map((item, idx) => (
              <div key={idx} className="group relative aspect-[4/3] overflow-hidden border border-border/40">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-6 py-20 sm:py-28 md:px-12">
        <div className="mx-auto grid max-w-5xl items-center gap-10 sm:gap-14 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Who's behind all these <span className="text-gold">awesome</span> tattoos?
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
              nulla, ut commodo diam libero vitae erat.
            </p>
            <a href="#about" className="link-cta mt-8 sm:mt-10">
              About me
            </a>
          </div>
          <div className="relative h-[300px] sm:h-[340px] md:h-[380px] w-full">
            <div className="group absolute left-0 top-0 h-40 sm:h-48 w-3/5 overflow-hidden border border-border shadow-2xl transition-all duration-300 hover:z-20 hover:scale-105">
              <img
                src="/tatto/Tatto%20image07.jpg"
                alt="Tattoo master in studio"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="group absolute right-0 top-12 sm:top-14 h-40 sm:h-48 w-1/2 overflow-hidden border border-border shadow-2xl transition-all duration-300 hover:z-20 hover:scale-105">
              <img
                src="/tatto/Tatto%20image11.jpg"
                alt="Tattooing detailed inking"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="group absolute bottom-0 left-1/4 h-32 sm:h-40 w-3/5 overflow-hidden border border-border shadow-2xl transition-all duration-300 hover:z-20 hover:scale-105">
              <img
                src="/tatto/Tatto%20image48.jpg"
                alt="Tattoo artistic precision"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section aria-hidden className="w-full overflow-hidden py-8 sm:py-12">
        {[0, 1, 2].map((row) => (
          <div key={row} className="marquee-track" style={{ animationDuration: `${24 + row * 8}s` }}>
            {[0, 1].map((dup) => (
              <span
                key={dup}
                className="whitespace-nowrap px-4 font-display text-[2.8rem] font-bold leading-[1.1] text-gold/85 sm:text-[4rem] md:text-[5rem]"
              >
                Tattooing - Cover ups - Piercing - Blackwork -
              </span>
            ))}
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 sm:py-28 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Read what <span className="text-gold">my clients</span>
              <br />
              say about my work
            </h2>
            <a href="#contact" className="link-cta">
              Make an appointment
            </a>
          </div>
          <div className="relative mt-10 sm:mt-12 grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-center">
            <div className="border border-border bg-ink-2/30 p-6 sm:p-8 lg:p-10 md:pr-16 lg:pr-20">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{current.quote}</p>
              <div className="mt-8 sm:mt-10 flex items-end justify-between gap-6">
                <div>
                  <p className="font-display text-sm font-semibold sm:text-base">{current.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{current.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    aria-label="Previous testimonial"
                    onClick={() => setT((p) => (p - 1 + testimonials.length) % testimonials.length)}
                    className="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:border-gold hover:text-gold"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    aria-label="Next testimonial"
                    onClick={() => setT((p) => (p + 1) % testimonials.length)}
                    className="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:border-gold hover:text-gold"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="relative h-[280px] sm:h-[320px] md:h-[360px] overflow-hidden border border-border md:-ml-12 lg:-ml-16 shadow-xl">
              <img
                src="/tatto/Tatto%20image51.jpg"
                alt="Client tattoo highlight"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative overflow-hidden px-6 py-20 sm:py-28 text-center md:px-12">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none font-display text-[4.5rem] font-bold text-foreground/[0.04] sm:text-[7.5rem] md:text-[9.5rem] lg:text-[11.5rem]"
        >
          Let's go
        </span>
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">Time to get yours</h2>
          <p className="mt-2 font-display text-lg font-semibold text-gold sm:text-xl">
            You won't regret it
          </p>
          <div className="mt-8">
            <a href="#contact" className="link-cta text-sm">
              Make an appointment
            </a>
          </div>
        </div>
      </section>

      {/* BOTTOM STRIP */}
      <section className="px-4 sm:px-6 md:px-12 py-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {[
            "/tatto/Tatto%20image20.jpeg",
            "/tatto/Tatto%20image28.jpeg",
            "/tatto/Tatto%20image30.jpeg",
            "/tatto/Tatto%20image35.jpeg",
            "/tatto/Tatto%20image45.jpeg",
            "/tatto/Tatto%20image47.jpeg",
          ].map((src, i) => (
            <div key={i} className="group relative aspect-[3/4] overflow-hidden border border-border/30">
              <img
                src={src}
                alt={`Tattoo showcase ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 px-6 pb-12 pt-16 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_2fr]">
          <div className="md:border-r md:border-border md:pr-10">
            <Logo />
            <p className="mt-5 text-xs text-muted-foreground">info@tattoon.com</p>
            <p className="mt-1 text-xs text-muted-foreground">(403) 806-6986</p>
            <div className="mt-5 flex gap-3 text-muted-foreground">
              <a href="#top" aria-label="Instagram" className="transition-colors hover:text-gold">
                <Instagram size={16} />
              </a>
              <a href="#top" aria-label="Facebook" className="transition-colors hover:text-gold">
                <Facebook size={16} />
              </a>
            </div>
          </div>
          <div className="md:pl-4">
            <nav className="flex flex-wrap gap-6 sm:gap-8 font-display text-[0.75rem] tracking-[0.18em]">
              {["Home", "About me", "Services", "Portfolio", "Contact"].map((l) => (
                <a key={l} href="#top" className="uppercase transition-colors hover:text-gold">
                  {l}
                </a>
              ))}
            </nav>
            <div className="mt-12 border-t border-border pt-5 text-left sm:text-right text-[0.7rem] text-muted-foreground">
              Created by Tattoon Studio — All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
