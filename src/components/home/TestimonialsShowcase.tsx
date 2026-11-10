"use client";

import React, { useState } from "react";
import {
  Star,
  Quote,
  PlaneLanding,
  Users,
  Sparkles,
  Car,
  Pause,
  Play,
} from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";

type ServiceKind = "airport" | "corporate" | "wedding" | "upcountry";

const MARQUEE_CSS = `
@keyframes trTestimonialsGlide {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

.tr-testimonials-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: trTestimonialsGlide 26s linear infinite;
}

.tr-testimonials-viewport:hover .tr-testimonials-track {
  animation-play-state: paused;
}

.tr-testimonials-track[data-paused="true"] {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .tr-testimonials-viewport {
    overflow-x: auto !important;
    mask-image: none !important;
    -webkit-mask-image: none !important;
  }
  .tr-testimonials-track {
    animation: none !important;
  }
}
`;

function ServiceIcon({ kind }: { kind: ServiceKind }) {
  const cls = "h-3.5 w-3.5 shrink-0 text-[#10B981]";
  switch (kind) {
    case "airport":
      return <PlaneLanding className={cls} />;
    case "corporate":
      return <Users className={cls} />;
    case "wedding":
      return <Sparkles className={cls} />;
    case "upcountry":
      return <Car className={cls} />;
  }
}

export function TestimonialsShowcase() {
  const { locale, dict } = useI18n();
  const t = dict.home.testimonials;
  const slides = t.items;
  const [isPaused, setIsPaused] = useState(false);

  const pauseLabel = locale === "fr" ? "Pause" : "Pause";
  const playLabel = locale === "fr" ? "Lire" : "Play";

  const renderCard = (slide: (typeof slides)[number], keyPrefix: string) => (
    <article
      key={`${keyPrefix}-${slide.id}`}
      style={{
        background:
          "linear-gradient(155deg, rgba(6, 18, 38, 0.82) 0%, rgba(10, 29, 58, 0.76) 65%, rgba(6, 55, 38, 0.74) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "24px",
        boxShadow:
          "0 22px 48px -16px rgba(2, 8, 22, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
      }}
      className="relative w-[290px] sm:w-[340px] lg:w-[375px] shrink-0 flex flex-col justify-between gap-4 p-5 sm:p-6 backdrop-blur-xl hover:border-[#FACC15]/60 transition-colors"
    >
      {/* Subtle Top Gold Specular Hairline */}
      <div
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(250, 204, 21, 0.5) 50%, transparent 100%)",
        }}
        className="pointer-events-none absolute top-0 inset-x-4 h-[1.5px]"
      />

      {/* Top Service Pill + 5 Stars */}
      <div className="flex items-center justify-between gap-2">
        <span
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "9999px",
            padding: "5px 11px",
          }}
          className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#FACC15] min-w-0"
        >
          <ServiceIcon kind={slide.serviceKind} />
          <span className="truncate">{slide.serviceTag}</span>
        </span>

        <div className="inline-flex items-center gap-0.5 shrink-0" aria-label={t.starsAria}>
          {[0, 1, 2, 3, 4].map((starIdx) => (
            <Star
              key={starIdx}
              style={{
                width: "13px",
                height: "13px",
                color: "#FACC15",
                fill: "#FACC15",
              }}
            />
          ))}
        </div>
      </div>

      {/* Praising Quote */}
      <div className="flex items-start gap-2.5 flex-1">
        <Quote className="h-4 w-4 text-[#FACC15]/80 shrink-0 mt-1" />
        <blockquote className="text-sm sm:text-[15px] font-medium text-slate-100 leading-[1.6]">
          &ldquo;{slide.preview}&rdquo;
        </blockquote>
      </div>

      {/* Author Row */}
      <div className="pt-3.5 border-t border-white/12 flex items-center gap-3">
        <div
          style={{
            backgroundColor: "#FACC15",
            color: "#061226",
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black tracking-wider shadow-sm"
        >
          {slide.initials}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-white truncate">
            {slide.name}
          </div>
          <div className="text-[11px] font-medium text-slate-300 truncate">
            {slide.originRole}
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="w-full space-y-7 sm:space-y-9">
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />

      {/* Clean Centered Header + Rating Pill + Optional Play/Pause Toggle */}
      <div className="px-5 sm:px-10 lg:px-14 text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div
            style={{
              backgroundColor: "rgba(6, 18, 38, 0.74)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "9999px",
              padding: "7px 16px",
            }}
            className="inline-flex items-center gap-3 backdrop-blur-xl shadow-md"
          >
            <div className="inline-flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#FACC15]">
                {t.ratingValue}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                {t.ratingScale}
              </span>
            </div>
            <span className="h-4 w-px bg-white/20" />
            <div className="inline-flex items-center gap-1" aria-label={t.starsAria}>
              {[0, 1, 2, 3, 4].map((idx) => (
                <Star
                  key={idx}
                  style={{
                    width: "13px",
                    height: "13px",
                    color: "#FACC15",
                    fill: "#FACC15",
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-200">
              {t.ratingLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-pressed={isPaused}
            aria-label={isPaused ? playLabel : pauseLabel}
            style={{
              backgroundColor: "rgba(6, 18, 38, 0.74)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              padding: "8px 14px",
            }}
            className="inline-flex items-center gap-1.5 backdrop-blur-xl text-[11px] font-extrabold uppercase tracking-wider text-slate-200 hover:border-[#FACC15] hover:text-[#FACC15] transition-colors cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play className="h-3 w-3 text-[#FACC15] fill-[#FACC15]" />
                <span>{playLabel}</span>
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 text-[#10B981]" />
                <span>{pauseLabel}</span>
              </>
            )}
          </button>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-sm">
          {t.headlineStart}
          <span style={{ color: "#FACC15" }} className="text-[#FACC15]">
            {t.headlineHighlight}
          </span>
        </h2>
      </div>

      {/* Multi-Card Seamless Infinite Gliding Slideshow (3 Cards on Desktop, Peek on Mobile) */}
      <div
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
        }}
        className="tr-testimonials-viewport relative w-full overflow-hidden py-1"
      >
        <div
          data-testid="testimonials-track"
          data-paused={isPaused ? "true" : "false"}
          className="tr-testimonials-track"
        >
          {/* Set A */}
          <div className="flex items-stretch gap-4 sm:gap-5 lg:gap-6 pr-4 sm:pr-5 lg:pr-6">
            {slides.map((slide) => renderCard(slide, "a"))}
          </div>
          {/* Set B (Duplicate for zero-stutter infinite wrap at -50%) */}
          <div
            aria-hidden="true"
            className="flex items-stretch gap-4 sm:gap-5 lg:gap-6 pr-4 sm:pr-5 lg:pr-6"
          >
            {slides.map((slide) => renderCard(slide, "b"))}
          </div>
        </div>
      </div>
    </div>
  );
}
