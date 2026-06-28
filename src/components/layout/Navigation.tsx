"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const navLinks = [
  { label: "Collection", href: "#collection" },
  { label: "Philosophy", href: "#story" },
  { label: "Atelier", href: "#signature" },
  { label: "Contact", href: "#footer" },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [activeHref, setActiveHref] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const isLightNav = overHero && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 48);
      setOverHero(y < window.innerHeight * 0.85);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-enter",
        { y: -16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.07,
          delay: 0.9,
          ease: "power3.out",
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const linkColor = isLightNav
    ? "text-ivory/70 hover:text-ivory"
    : "text-ink/65 hover:text-ink";
  const logoColor = isLightNav ? "text-ivory" : "text-ink";
  const barColor = isLightNav ? "bg-ivory" : "bg-ink";
  const ctaClass = isLightNav
    ? "border-ivory/30 text-ivory hover:border-bronze-light hover:text-bronze-light"
    : "border-ink/15 text-ink hover:border-bronze hover:text-bronze";

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-700 ${
          scrolled || menuOpen
            ? "border-b border-stone-light/25 bg-ivory/80 py-4 backdrop-blur-xl"
            : "bg-transparent py-6 md:py-8"
        }`}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
          <a
            href="#"
            data-cursor="Explore"
            className={`nav-enter font-display text-xl font-light tracking-[0.28em] transition-colors duration-500 md:text-2xl ${logoColor}`}
          >
            ATELIER
            <span className="text-bronze italic"> NOCTURN</span>
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-enter group relative text-[11px] font-light tracking-[0.22em] uppercase transition-colors duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bronze ${linkColor} ${
                  activeHref === link.href ? (isLightNav ? "text-ivory" : "text-ink") : ""
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-bronze transition-all duration-500 ${
                    activeHref === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <MagneticButton
              as="a"
              href="#collection"
              data-cursor="Explore"
              className={`nav-enter border px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-colors duration-500 ${ctaClass}`}
            >
              Discover
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-px w-6 transition-all duration-500 ${barColor} ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 transition-all duration-500 ${barColor} ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-ivory transition-all duration-700 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal={menuOpen}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl font-light tracking-wide transition-colors hover:text-bronze focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bronze"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ${menuOpen ? index * 80 : 0}ms, transform 0.5s ${menuOpen ? index * 80 : 0}ms, color 0.3s`,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
