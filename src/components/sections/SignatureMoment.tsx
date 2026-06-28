"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsFinePointer } from "@/hooks/useIsFinePointer";

gsap.registerPlugin(ScrollTrigger);

/**
 * Signature Moment — "The Meridian Veil"
 * Scroll-pinned chamber where pointer position reveals fabric beneath
 * a dark veil. Typography fractures on scroll, then reassembles.
 */
export default function SignatureMoment() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useIsFinePointer();

  const updateSpotlight = useCallback((clientX: number, clientY: number) => {
    const rect = pinRef.current?.getBoundingClientRect();
    const spotlight = spotlightRef.current;
    const hint = hintRef.current;
    if (!rect || !spotlight) return;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    spotlight.style.background = `radial-gradient(circle 220px at ${x}% ${y}%, transparent 0%, rgba(8,8,8,0.9) 100%)`;
    spotlight.style.opacity = "1";
    if (hint) hint.textContent = "Revealing";
  }, []);

  const hideSpotlight = useCallback(() => {
    const spotlight = spotlightRef.current;
    const hint = hintRef.current;
    if (spotlight) spotlight.style.opacity = "0";
    if (hint) hint.textContent = "Enter the veil";
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([".sig-char", ".sig-detail"], { clearProps: "all", opacity: 1, y: 0 });
        if (veilRef.current) veilRef.current.style.opacity = "0.5";
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=140%",
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.fromTo(veilRef.current, { opacity: 1 }, { opacity: 0.35, ease: "none" })
        .fromTo(
          ".sig-char",
          { y: 0, opacity: 1 },
          {
            y: (i) => (i % 2 === 0 ? -72 : 72),
            opacity: 0.25,
            stagger: 0.02,
            ease: "none",
          },
          0
        )
        .fromTo(
          ".sig-detail",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: "none" },
          0.45
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const title = "WOVEN IN DARKNESS";

  return (
    <section
      id="signature"
      ref={sectionRef}
      className="relative bg-ink"
      aria-label="Atelier experience"
    >
      <div
        ref={pinRef}
        className="relative flex h-screen items-center justify-center overflow-hidden"
        onMouseMove={(e) => updateSpotlight(e.clientX, e.clientY)}
        onMouseEnter={(e) => updateSpotlight(e.clientX, e.clientY)}
        onMouseLeave={hideSpotlight}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) updateSpotlight(touch.clientX, touch.clientY);
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (touch) updateSpotlight(touch.clientX, touch.clientY);
        }}
        onTouchEnd={hideSpotlight}
      >
        <div className="absolute inset-0">
          <Image
            src="/images/signature.webp"
            alt="Luxury textile close-up"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div ref={veilRef} className="absolute inset-0 bg-ink/85" aria-hidden />

        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{
            opacity: finePointer ? 0 : reducedMotion ? 0 : 0.6,
            background: reducedMotion
              ? "radial-gradient(circle 280px at 50% 50%, transparent 0%, rgba(8,8,8,0.85) 100%)"
              : undefined,
          }}
        />

        <div className="grain absolute inset-0 z-10" aria-hidden />

        <div className="relative z-20 px-6 text-center">
          <p className="sig-detail mb-8 text-[11px] tracking-[0.4em] text-bronze-light uppercase opacity-0">
            The Atelier Chamber
          </p>

          <h2
            className="font-display text-[clamp(2rem,8vw,6.5rem)] leading-[0.95] font-light tracking-[0.04em] text-ivory"
            aria-label={title}
          >
            {title.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="sig-char inline-block"
                style={{ minWidth: char === " " ? "0.3em" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>

          <p className="sig-detail mx-auto mt-8 max-w-md text-sm leading-relaxed font-light text-ivory/50 opacity-0">
            Move through the veil. Four hundred hours of handwork before a single
            garment leaves the atelier.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
          <p
            ref={hintRef}
            className="text-[10px] tracking-[0.3em] text-ivory/30 uppercase"
            data-cursor="Reveal"
          >
            {finePointer ? "Enter the veil" : "Touch to reveal"}
          </p>
        </div>
      </div>
    </section>
  );
}
