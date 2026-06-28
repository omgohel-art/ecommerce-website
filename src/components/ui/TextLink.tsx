"use client";

import type { ReactNode } from "react";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  light?: boolean;
  cursorLabel?: string;
}

export default function TextLink({
  href,
  children,
  className = "",
  light = false,
  cursorLabel = "Explore",
}: TextLinkProps) {
  return (
    <a
      href={href}
      data-cursor={cursorLabel}
      className={`group link-luxury inline-flex items-center gap-1 text-[11px] tracking-[0.25em] uppercase transition-colors duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
        light
          ? "text-ivory/55 hover:text-ivory"
          : "text-stone hover:text-ink"
      } ${className}`}
    >
      <span>{children}</span>
      <span
        className={`inline-block transition-transform duration-500 group-hover:translate-x-1 ${
          light ? "text-ivory/40 group-hover:text-ivory" : ""
        }`}
        aria-hidden
      >
        →
      </span>
    </a>
  );
}
