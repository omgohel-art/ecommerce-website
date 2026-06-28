"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".newsletter-item",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!submitted || reducedMotion || !successRef.current) return;

    gsap.fromTo(
      successRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, [submitted, reducedMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ivory-muted py-24 md:py-32"
      aria-labelledby="newsletter-heading"
    >
      <div className="newsletter-item absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-stone-light/40 to-transparent" />

      <div className="mx-auto max-w-[1600px] px-6 text-center md:px-12">
        <p className="newsletter-item mb-4 text-[11px] tracking-[0.32em] text-stone uppercase">
          Private Circle
        </p>
        <h2
          id="newsletter-heading"
          className="newsletter-item font-display text-[clamp(2rem,5vw,4rem)] font-light"
        >
          Enter the <span className="text-bronze italic">Nocturne</span>
        </h2>
        <p className="newsletter-item mx-auto mt-4 max-w-md text-sm font-light text-stone">
          Early access to collections, atelier previews, and private fittings.
        </p>

        {submitted ? (
          <p
            ref={successRef}
            className="newsletter-item mt-10 font-display text-2xl text-bronze italic"
            role="status"
          >
            You are on the list.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="newsletter-item mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 border-b border-ink/20 bg-transparent px-2 py-3 text-sm font-light tracking-wide outline-none transition-all duration-500 placeholder:text-stone/50 focus:border-bronze focus:pb-4"
            />
            <MagneticButton
              type="submit"
              data-cursor="Explore"
              className="bg-ink px-8 py-3 text-[11px] tracking-[0.2em] text-ivory uppercase transition-colors duration-500 hover:bg-bronze"
            >
              Request Access
            </MagneticButton>
          </form>
        )}
      </div>
    </section>
  );
}
