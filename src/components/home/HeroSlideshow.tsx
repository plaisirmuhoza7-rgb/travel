import React from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

const HERO_KEYFRAMES = `
@keyframes trHeroSlideFade2 {
  0%, 28% { opacity: 0; }
  33%, 67% { opacity: 1; }
  70%, 100% { opacity: 0; }
}
@keyframes trHeroSlideFade3 {
  0%, 61% { opacity: 0; }
  66%, 95% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes trHeroDot1 {
  0%, 28% { width: 36px; background-color: #FACC15; }
  33%, 95% { width: 12px; background-color: rgba(255,255,255,0.5); }
  100% { width: 36px; background-color: #FACC15; }
}
@keyframes trHeroDot2 {
  0%, 28% { width: 12px; background-color: rgba(255,255,255,0.5); }
  33%, 61% { width: 36px; background-color: #FACC15; }
  66%, 100% { width: 12px; background-color: rgba(255,255,255,0.5); }
}
@keyframes trHeroDot3 {
  0%, 61% { width: 12px; background-color: rgba(255,255,255,0.5); }
  66%, 95% { width: 36px; background-color: #FACC15; }
  100% { width: 12px; background-color: rgba(255,255,255,0.5); }
}
`;

export async function HeroSlideshow() {
  const { dict } = await getServerDictionary();

  return (
    <section
      style={{ backgroundColor: "#061226", minHeight: "82vh" }}
      className="relative w-full min-h-[82vh] flex items-center overflow-hidden bg-[#061226] text-white"
    >
      <style dangerouslySetInnerHTML={{ __html: HERO_KEYFRAMES }} />

      {/* Slide 1 Base Layer: Laptop (/1p.png) | Mobile (/1l.png) */}
      <div
        style={{ zIndex: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <picture className="block w-full h-full">
          <source media="(min-width: 768px)" srcSet="/1p.png" />
          <img
            src="/1l.png"
            alt={dict.home.hero.slide1Alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Slide 2 Animated Crossfade Layer: Laptop (/manyp.png) | Mobile (/manyl.png) */}
      <div
        style={{
          zIndex: 2,
          animation: "trHeroSlideFade2 13.5s infinite ease-in-out",
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <picture className="block w-full h-full">
          <source media="(min-width: 768px)" srcSet="/manyp.png" />
          <img
            src="/manyl.png"
            alt={dict.home.hero.slide2Alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Slide 3 Animated Crossfade Layer: Coasters Fleet (/coasters.png) */}
      <div
        style={{
          zIndex: 3,
          animation: "trHeroSlideFade3 13.5s infinite ease-in-out",
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <img
          src="/coasters.png"
          alt={dict.home.hero.slide3Alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Dark Cinematic Scrim so photos & words are 100% clear with centered text */}
      <div
        style={{
          zIndex: 4,
          background:
            "linear-gradient(180deg, rgba(6,18,38,0.78) 0%, rgba(6,18,38,0.62) 50%, rgba(6,18,38,0.85) 100%)",
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Minimal Foreground Content - Centered */}
      <div
        style={{ zIndex: 10 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col items-center justify-center text-center"
      >
        <div className="max-w-4xl space-y-8 flex flex-col items-center text-center">
          {/* TWO SENTENCES: (big) Travel Rwanda. | (small) Ride with us in comfort. */}
          <div className="space-y-3 md:space-y-4 text-center">
            <h1
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.75rem)", lineHeight: 1.05 }}
              className="font-black uppercase tracking-tight text-white drop-shadow-lg md:whitespace-nowrap"
            >
              {dict.home.hero.titlePrefix}{" "}
              <span style={{ color: "#FACC15" }} className="text-[#FACC15]">
                {dict.home.hero.titleHighlight}
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium sm:font-semibold text-slate-100 drop-shadow-md">
              {dict.home.hero.subtitle}
            </p>
          </div>

          {/* Well structured CTAs in sleek pill form - Centered */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              paddingTop: "8px",
              width: "100%",
            }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/plan-your-journey"
              style={{
                backgroundColor: "#FACC15",
                color: "#061226",
                border: "2px solid #FACC15",
                borderRadius: "9999px",
                padding: "12px 24px 12px 30px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                boxShadow: "0 12px 28px -6px rgba(250, 204, 21, 0.4)",
                minWidth: "184px",
              }}
              className="group sm:whitespace-nowrap hover:bg-[#EAB308] hover:border-[#EAB308] active:scale-[0.98] transition-all"
            >
              <span>{dict.home.hero.bookNow}</span>
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "9999px",
                  backgroundColor: "#061226",
                  color: "#FACC15",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                className="transition-transform group-hover:translate-x-0.5"
              >
                <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
              </span>
            </Link>

            <Link
              href="/contact"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#061226",
                border: "2px solid #FACC15",
                borderRadius: "9999px",
                padding: "13px 30px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                boxShadow: "0 12px 28px -6px rgba(6, 18, 38, 0.45)",
                minWidth: "184px",
              }}
              className="group sm:whitespace-nowrap hover:bg-[#FEF9C3] active:scale-[0.98] transition-all"
            >
              <Phone
                style={{ width: "16px", height: "16px", color: "#061226", flexShrink: 0 }}
                className="transition-transform group-hover:scale-110"
              />
              <span>{dict.home.hero.contactUs}</span>
            </Link>
          </div>

          {/* Synchronized Slide Indicator Bars - Centered */}
          <div className="flex items-center justify-center gap-2.5 pt-6" aria-hidden="true">
            <span
              style={{
                height: "8px",
                width: "36px",
                backgroundColor: "#FACC15",
                borderRadius: "9999px",
                animation: "trHeroDot1 13.5s infinite ease-in-out",
              }}
              className="rounded-full block transition-all"
            />
            <span
              style={{
                height: "8px",
                width: "12px",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "9999px",
                animation: "trHeroDot2 13.5s infinite ease-in-out",
              }}
              className="rounded-full block transition-all"
            />
            <span
              style={{
                height: "8px",
                width: "12px",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "9999px",
                animation: "trHeroDot3 13.5s infinite ease-in-out",
              }}
              className="rounded-full block transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
