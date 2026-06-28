"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Maison: ["Collection", "Lookbook", "Campaign", "Archive"],
  House: ["Philosophy", "Atelier", "Sustainability", "Press"],
  Service: ["Contact", "Appointments", "Care Guide", "Shipping"],
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".footer-block",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer id="footer" ref={footerRef} className="bg-ink text-ivory">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        <div className="mb-20 overflow-hidden">
          <p
            className="font-display text-[clamp(3rem,12vw,13rem)] leading-[0.85] font-light tracking-tight text-ivory/[0.06]"
            aria-hidden
          >
            ATELIER NOCTURN
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-block">
              <h3 className="mb-5 text-[11px] tracking-[0.25em] text-stone-light uppercase">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="footer-link text-sm font-light text-ivory/60 transition-colors duration-500 hover:text-bronze-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bronze-light"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-block mt-20 flex flex-col items-start justify-between gap-6 border-t border-ivory/10 pt-8 md:flex-row md:items-center">
          <p className="text-xs font-light text-stone-light">
            © 2026 Atelier Nocturn. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Instagram", "Pinterest", "Vogue"].map((social) => (
              <a
                key={social}
                href="#"
                className="footer-link text-[11px] tracking-[0.2em] text-ivory/40 uppercase transition-colors duration-500 hover:text-ivory focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bronze-light"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
