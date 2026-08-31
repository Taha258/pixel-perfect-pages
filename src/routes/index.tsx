import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Facebook, ArrowUpRight } from "lucide-react";

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

/** Temporary blue placeholder — replace with real <img> later. */
function Ph({ className = "", ratio }: { className?: string; ratio?: string }) {
  return <div className={`img-ph ${className}`} style={ratio ? { aspectRatio: ratio } : undefined} />;
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center border border-gold font-display text-sm text-gold">
        T
      </span>
      <span className="font-display text-sm tracking-[0.35em] text-foreground">TATTOON</span>
    </a>
  );
}

const services = [
  { title: "Tattoo design", offset: "md:mt-0" },
  { title: "Tattooing", offset: "md:mt-8" },
  { title: "Piercing", offset: "md:mt-0" },
  { title: "Cover ups", offset: "md:mt-8" },
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

function Index() {
  const [t, setT] = useState(0);
  const current = testimonials[t]!;

  return (
    <div id="top" className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative min-h-[100svh] lg:grid lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-between px-6 py-6 md:px-12 lg:py-8">
          <Logo />
          <div className="max-w-md py-20">
            <h1 className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Blackwork &<br />
              Oldschool <span className="text-gold">Expert</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique.
            </p>
            <div className="mt-10 flex flex-col items-start gap-5">
              <a href="#contact" className="link-cta">
                Make an appointment
              </a>
              <a href="#portfolio" className="link-cta">
                My work
              </a>
            </div>
          </div>
          <div />
        </div>
        <div className="relative">
          <Ph className="h-64 w-full lg:absolute lg:inset-0 lg:h-full" />
          <span className="absolute right-6 top-6 hidden text-gold lg:block">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 py-24 md:px-12">
        <h2 className="text-center font-display text-2xl font-bold tracking-wide">
          My <span className="text-gold">Services</span>
        </h2>
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-4">
          {services.map((s) => (
            <article
              key={s.title}
              className={`border border-border bg-ink-2/40 p-6 transition-colors hover:border-gold ${s.offset}`}
            >
              <div className="h-6 w-6 bg-placeholder" />
              <h3 className="mt-8 font-display text-sm font-semibold">{s.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section id="portfolio" className="space-y-2">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
          <Ph ratio="1/1" className="md:col-span-1" />
          <Ph ratio="1/1" className="md:col-span-2" />
          <Ph ratio="1/1" className="md:col-span-1" />
          <Ph ratio="1/1" className="md:col-span-1" />
          <Ph ratio="1/1" className="md:col-span-1" />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Ph ratio="4/3" />
          <Ph ratio="4/3" />
          <Ph ratio="4/3" />
          <Ph ratio="4/3" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-6 py-28 md:px-12">
        <div className="mx-auto grid max-w-4xl items-center gap-14 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
              Who's behind all these <span className="text-gold">awesome</span> tattoos?
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
              nulla, ut commodo diam libero vitae erat.
            </p>
            <a href="#about" className="link-cta mt-10">
              About me
            </a>
          </div>
          <div className="relative h-[320px]">
            <Ph className="absolute left-0 top-0 h-40 w-3/5" />
            <Ph className="absolute right-0 top-16 h-40 w-1/2" />
            <Ph className="absolute bottom-0 left-1/4 h-32 w-3/5" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section aria-hidden className="overflow-hidden py-10">
        {[0, 1, 2].map((row) => (
          <div key={row} className="marquee-track" style={{ animationDuration: `${24 + row * 8}s` }}>
            {[0, 1].map((dup) => (
              <span
                key={dup}
                className="whitespace-nowrap px-4 font-display text-[3.5rem] font-bold leading-[1.1] text-transparent sm:text-[5rem]"
                style={{ WebkitTextStroke: "1px oklch(1 0 0 / 8%)" }}
              >
                Tattooing - Cover ups - Piercing - Blackwork -
              </span>
            ))}
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
              Read what <span className="text-gold">my clients</span>
              <br />
              say about my work
            </h2>
            <a href="#contact" className="link-cta">
              Make an appointment
            </a>
          </div>
          <div className="relative mt-12 grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-center">
            <div className="border border-border p-8 md:pr-24">
              <p className="text-sm leading-relaxed text-muted-foreground">{current.quote}</p>
              <div className="mt-10 flex items-end justify-between gap-6">
                <div>
                  <p className="font-display text-sm font-semibold">{current.name}</p>
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
            <Ph className="h-[300px] md:-ml-24 md:h-[340px]" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative overflow-hidden px-6 py-28 text-center md:px-12">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 font-display text-[6rem] font-bold text-foreground/[0.04] sm:text-[9rem]"
        >
          Let's go
        </span>
        <div className="relative">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Time to get yours</h2>
          <p className="mt-2 font-display text-lg font-semibold text-gold sm:text-xl">
            You won't regret it
          </p>
          <div className="mt-8">
            <a href="#contact" className="link-cta">
              Make an appointment
            </a>
          </div>
        </div>
      </section>

      {/* BOTTOM STRIP */}
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Ph key={i} ratio="3/4" />
        ))}
      </div>

      {/* FOOTER */}
      <footer className="px-6 pb-10 pt-16 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_2fr]">
          <div className="md:border-r md:border-border md:pr-10">
            <Logo />
            <p className="mt-5 text-xs text-muted-foreground">info@tattoon.com</p>
            <p className="mt-1 text-xs text-muted-foreground">(403) 806-6986</p>
            <div className="mt-5 flex gap-3 text-muted-foreground">
              <a href="#top" aria-label="Instagram" className="transition-colors hover:text-gold">
                <Instagram size={15} />
              </a>
              <a href="#top" aria-label="Facebook" className="transition-colors hover:text-gold">
                <Facebook size={15} />
              </a>
            </div>
          </div>
          <div className="md:pl-4">
            <nav className="flex flex-wrap gap-8 font-display text-[0.7rem] tracking-[0.18em]">
              {["Home", "About me", "Services", "Portfolio", "Contact"].map((l) => (
                <a key={l} href="#top" className="uppercase transition-colors hover:text-gold">
                  {l}
                </a>
              ))}
            </nav>
            <div className="mt-12 border-t border-border pt-5 text-right text-[0.65rem] text-muted-foreground">
              Created by Tattoon Studio — All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
