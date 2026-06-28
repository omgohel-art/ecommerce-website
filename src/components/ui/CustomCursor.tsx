"use client";

import { useEffect, useRef, useState } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    setEnabled(true);

    document.documentElement.classList.add("custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, input, [role='button']"
      );
      if (!el) {
        ring.dataset.state = "default";
        label.textContent = "";
        return;
      }
      const state = el.dataset.cursor ?? "pointer";
      ring.dataset.state = state === "pointer" ? "hover" : state;
      label.textContent =
        state !== "pointer" && state !== "hover" ? state : "";
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      const { x, y } = pos.current;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" data-state="default">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
