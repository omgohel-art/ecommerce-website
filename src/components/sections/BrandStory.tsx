"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  { number: "01", title: "Shadow", text: "Darkness reveals the true line" },
  { number: "02", title: "Silence", text: "Craft speaks without ornament" },
  { number: "03", title: "Form", text: "Architecture worn close to skin" },
];

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        accentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: accentRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".story-line").forEach((line) => {
        gsap.fromTo(
          line,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 92%",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".pillar-item").forEach((item, index) => {
        gsap.fromTo(
          item,
          { x: index % 2 === 0 ? -36 : 36, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          }
        );
      });

      gsap.to(imageRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-24 text-ivory md:py-40"
      aria-labelledby="story-heading"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col justify-center">
            <p className="mb-6 text-[11px] tracking-[0.32em] text-stone-light uppercase">
              Philosophy
            </p>

            <h2
              id="story-heading"
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] font-light"
            >
              <span className="block overflow-hidden">
                <span className="story-line inline-block">True luxury</span>
              </span>
              <span className="block overflow-hidden">
                <span className="story-line inline-block text-bronze-light italic">
                  lives in
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="story-line inline-block">the unseen.</span>
              </span>
            </h2>

            <div className="mt-16 space-y-10 border-t border-ivory/10 pt-10">
              {pillars.map((pillar) => (
                <div
                  key={pillar.number}
                  className="pillar-item group flex items-baseline gap-8"
                >
                  <span className="font-display text-sm text-bronze-light transition-transform duration-500 group-hover:translate-x-1">
                    {pillar.number}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-light">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm font-light text-stone-light">
                      {pillar.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              ref={imageRef}
              className="relative aspect-[3/4] overflow-hidden gpu"
            >
              <Image
                src="/images/story-main.webp"
                alt="Atelier craftsmanship detail"
                fill
                className="object-cover object-[center_15%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div
              ref={accentRef}
              className="absolute -right-4 -bottom-6 hidden w-[42%] overflow-hidden border border-ivory/15 bg-ink-soft md:block"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/story-accent.webp"
                  alt="Editorial fabric detail"
                  fill
                  className="object-cover object-left opacity-90"
                  sizes="200px"
                />
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 hidden bg-bronze px-8 py-6 md:block">
              <p className="font-display text-5xl font-light text-ivory">34</p>
              <p className="mt-1 text-[10px] tracking-[0.25em] text-ivory/70 uppercase">
                Master Artisans
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
