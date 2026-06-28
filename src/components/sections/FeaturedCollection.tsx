"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, formatPrice } from "@/lib/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".product-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".product-reveal").forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: frame,
              start: "top 88%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative bg-ivory py-24 md:py-40"
      aria-labelledby="collection-heading"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div
          ref={headingRef}
          className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-4 text-[11px] tracking-[0.32em] text-stone uppercase">
              Curated Pieces
            </p>
            <h2
              id="collection-heading"
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-light"
            >
              Night
              <span className="text-bronze italic"> Edit</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed font-light text-stone md:text-right">
            Four silhouettes conceived as editorial studies — proportion, drape,
            and the confidence of restraint.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) {
  const layoutClasses = [
    "md:col-span-7 md:row-span-2",
    "md:col-span-5 md:col-start-8",
    "md:col-span-5",
    "md:col-span-7 md:col-start-6",
  ];

  const aspectClasses = [
    "aspect-[4/5] md:aspect-[3/4]",
    "aspect-[4/5] md:aspect-square",
    "aspect-[4/5]",
    "aspect-[4/5] md:aspect-[3/4]",
  ];

  return (
    <article
      className={`product-card group relative ${layoutClasses[index]}`}
      data-cursor="View"
    >
      <div
        className={`product-card-inner product-reveal relative overflow-hidden bg-ivory-muted ${aspectClasses[index]}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="product-img-primary object-cover"
          style={{ objectPosition: product.imagePosition ?? "center" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <Image
          src={product.hoverImage}
          alt={`${product.name} alternate view`}
          fill
          className="product-img-hover object-cover opacity-0"
          style={{ objectPosition: product.hoverImagePosition ?? "center" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] tracking-[0.25em] text-stone uppercase">
            {product.category}
          </p>
          <h3 className="font-display text-xl font-light md:text-2xl">
            {product.name}
          </h3>
          <p className="product-detail mt-1 text-xs font-light text-stone">
            {product.description}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-lg text-bronze">
            {formatPrice(product.price)}
          </p>
          <span className="product-cta mt-2 block text-[10px] tracking-[0.2em] text-ink uppercase">
            View Piece →
          </span>
        </div>
      </div>

      <span
        className="pointer-events-none absolute -top-3 -left-1 font-display text-[8rem] leading-none font-light text-ink/[0.03] select-none md:text-[10rem]"
        aria-hidden
      >
        {product.id}
      </span>
    </article>
  );
}
