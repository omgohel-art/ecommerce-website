"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  as?: "button" | "a";
  href?: string;
  type?: "button" | "submit";
  "data-cursor"?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  strength = 0.3,
  as = "button",
  href,
  type = "button",
  "data-cursor": dataCursor,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const isResting = offset.x === 0 && offset.y === 0;
  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: isResting
      ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
      : "transform 0.12s ease-out",
  };

  const shared = {
    ref,
    className: `${className} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bronze focus-visible:ring-offset-2`,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    "data-cursor": dataCursor,
  };

  if (as === "a" && href) {
    return (
      <a href={href} {...shared}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} {...shared}>
      {children}
    </button>
  );
}
