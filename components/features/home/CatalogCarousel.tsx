"use client";

import { useCallback, useState } from "react";
import { CATALOG_CAROUSEL_ITEMS } from "./catalogCarouselData";

function CarouselCard({
  imageNum,
  name,
}: {
  imageNum: number;
  name: string;
}) {
  const [ok, setOk] = useState(true);
  const handleError = useCallback(() => setOk(false), []);

  return (
    <div className="flex w-[148px] shrink-0 flex-col sm:w-[168px] md:w-[180px]">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm">
        {ok ? (
          <img
            src={`/brand/${imageNum}.png`}
            alt={name || `Producto ${imageNum}`}
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
            onError={handleError}
          />
        ) : null}
      </div>
      <p
        className="mt-3 min-h-[2.75rem] px-0.5 text-center text-[11px] font-semibold uppercase leading-snug tracking-wide text-[#1d1d1f]/85 sm:text-xs"
        title={name || undefined}
      >
        {name || "\u00A0"}
      </p>
    </div>
  );
}

export function CatalogCarousel() {
  const loop = [...CATALOG_CAROUSEL_ITEMS, ...CATALOG_CAROUSEL_ITEMS];

  return (
    <div
      className="catalog-marquee-wrap relative mt-10 w-full"
      role="region"
      aria-label="Carrusel de productos del catálogo Ellas"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-white to-transparent sm:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-white to-transparent sm:w-14" />
      <div className="overflow-hidden">
        <div className="catalog-marquee-track flex w-max gap-5 sm:gap-6">
          {loop.map((item, i) => (
            <CarouselCard
              key={`${item.image}-${i}`}
              imageNum={item.image}
              name={item.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
