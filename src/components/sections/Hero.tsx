"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui/MagneticButton";
import TextLink from "@/components/ui/TextLink";
import { useLenis } from "@/components/SmoothScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { isFinePointer } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const headlineLines = [
  { text: "After Dusk,", italic: false },
  { text: "Form Emerges", italic: true },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  const scrollToNextSection = () => {
    const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
    if (!next) return;

    if (lenis) {
      lenis.scrollTo(next, { duration: 1.35 });
      return;
    }

    next.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          [
            curtainTopRef.current,
            curtainBottomRef.current,
            imageRef.current,
            overlayRef.current,
            ".hero-char",
            ".hero-fade",
            ".hero-eyebrow",
          ],
          {
            clearProps: "all",
            opacity: 1,
            y: 0,
            yPercent: 0,
            scale: 1,
            scaleY: 0,
            clipPath: "none",
            filter: "none",
            letterSpacing: undefined,
          }
        );
        return;
      }

      // Initial hidden states
      gsap.set(imageRef.current, {
        scale: 1.28,
        opacity: 0,
        clipPath: "inset(18% 0 18% 0)",
      });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(".hero-char", {
        yPercent: 120,
        opacity: 0,
        rotateX: 40,
        filter: "blur(8px)",
      });
      gsap.set(".hero-eyebrow", { letterSpacing: "0.8em", opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Split-panel curtain parting (top up, bottom down)
      tl.to(
        curtainTopRef.current,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "power4.inOut",
        },
        0
      ).to(
        curtainBottomRef.current,
        {
          yPercent: 100,
          duration: 1.1,
          ease: "power4.inOut",
        },
        0
      );

      // Image: clip-path uncover + scale settle + overlay fade-in
      tl.to(
        imageRef.current,
        {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0)",
          duration: 1.8,
          ease: "power2.out",
        },
        0.35
      )
        .to(
          overlayRef.current,
          { opacity: 1, duration: 1.2, ease: "power2.out" },
          0.55
        )
        // Headline char rise + focus-pull (blur -> sharp)
        .to(
          ".hero-char",
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.022,
            ease: "power4.out",
          },
          0.7
        )
        // Eyebrow tracking-in
        .to(
          ".hero-eyebrow",
          {
            letterSpacing: "0.4em",
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          },
          0.5
        )
        .fromTo(
          ".hero-fade",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
          1.05
        )
        .fromTo(
          ".hero-frame",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
          1.0
        );

      // Scroll-driven parallax + gentle zoom + dim
      gsap.to(imageRef.current, {
        yPercent: 14,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(overlayRef.current, {
        opacity: 1.6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Mouse parallax with depth layers (image vs overlay move at different rates)
      if (isFinePointer() && parallaxRef.current) {
        const quickImgX = gsap.quickTo(parallaxRef.current, "x", {
          duration: 1.2,
          ease: "power3.out",
        });
        const quickImgY = gsap.quickTo(parallaxRef.current, "y", {
          duration: 1.2,
          ease: "power3.out",
        });
        const quickOvX = gsap.quickTo(overlayRef.current, "x", {
          duration: 1.6,
          ease: "power3.out",
        });
        const quickOvY = gsap.quickTo(overlayRef.current, "y", {
          duration: 1.6,
          ease: "power3.out",
        });

        const onMove = (e: MouseEvent) => {
          const rect = sectionRef.current?.getBoundingClientRect();
          if (!rect) return;
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          quickImgX(relX * 24);
          quickImgY(relY * 16);
          quickOvX(relX * 10);
          quickOvY(relY * 7);
        };

        const section = sectionRef.current;
        section?.addEventListener("mousemove", onMove);

        return () => {
          section?.removeEventListener("mousemove", onMove);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen min-h-[700px] items-end overflow-hidden"
      aria-label="Introduction"
    >
      {/* Split-panel curtain: top half rises, bottom half drops */}
      <div
        ref={curtainTopRef}
        className="absolute inset-x-0 top-0 z-20 h-1/2 bg-ivory gpu"
        aria-hidden
      />
      <div
        ref={curtainBottomRef}
        className="absolute inset-x-0 bottom-0 z-20 h-1/2 bg-ivory gpu"
        aria-hidden
      />

      <div ref={imageRef} className="absolute inset-0 gpu">
        <div ref={parallaxRef} className="absolute inset-[-4%]">
          <Image
            src="/images/hero.webp"
            alt="Editorial fashion in dramatic light"
            fill
            priority
            className="object-cover object-[center_20%]"
            sizes="100vw"
          />
        </div>
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 to-transparent" />
      </div>

      <div className="grain absolute inset-0 z-10" aria-hidden />

      <div
        className="hero-frame absolute top-28 right-6 bottom-28 left-6 z-[15] origin-left border border-ivory/15 md:right-12 md:left-12"
        aria-hidden
      />

      <div className="relative z-30 mx-auto w-full max-w-[1600px] px-6 pb-16 md:px-12 md:pb-24">
        <p className="hero-eyebrow mb-8 text-[10px] tracking-[0.4em] text-ivory/45 uppercase">
          <span className="text-bronze-light">01</span>
          <span className="mx-3 opacity-30">—</span>
          Prologue
        </p>

        <div className="max-w-4xl">
          <p className="hero-fade mb-6 text-[11px] font-light tracking-[0.38em] text-ivory/55 uppercase">
            Autumn / Winter 2026
          </p>

          <h1 className="font-display text-[clamp(3.2rem,11vw,9rem)] leading-[0.9] font-light tracking-tight text-ivory">
            {headlineLines.map((line) => (
              <span key={line.text} className="block overflow-hidden py-1">
                <span className="inline-block">
                  {line.text.split("").map((char, index) => (
                    <span
                      key={`${line.text}-${index}`}
                      className={`hero-char inline-block ${
                        line.italic ? "text-bronze-light italic" : ""
                      }`}
                      style={{
                        minWidth: char === " " ? "0.28em" : undefined,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-fade mt-8 max-w-md text-sm leading-relaxed font-light tracking-wide text-ivory/65 md:text-base">
            Nocturnal silhouettes shaped in Parisian ateliers. Each garment a
            study in shadow, proportion, and quiet power.
          </p>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-8">
            <MagneticButton
              data-cursor="Explore"
              className="group relative overflow-hidden bg-ivory px-8 py-4 text-[11px] tracking-[0.25em] text-ink uppercase transition-colors duration-500 hover:text-ivory"
            >
              <span className="relative z-10">View Collection</span>
              <span className="absolute inset-0 origin-left scale-x-0 bg-bronze transition-transform duration-500 group-hover:scale-x-100" />
            </MagneticButton>

            <TextLink href="#story" light cursorLabel="Explore">
              The Philosophy
            </TextLink>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToNextSection}
          aria-label="Scroll to next section"
          data-cursor="Scroll"
          className="hero-fade absolute right-6 bottom-8 hidden cursor-pointer border-0 bg-transparent p-0 md:right-12 md:block"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] tracking-[0.32em] text-ivory/35 uppercase [writing-mode:vertical-lr]">
              Scroll
            </span>
            <div className="h-16 w-px overflow-hidden bg-ivory/20">
              <div className="h-full w-full animate-[scrollPulse_2.2s_ease-in-out_infinite] bg-ivory/55" />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
