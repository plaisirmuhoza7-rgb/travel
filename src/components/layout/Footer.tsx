import React from "react";
import Link from "next/link";
import { Phone, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Footer() {
  const { dict } = await getServerDictionary();
  const whatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(dict.footer.whatsappGreeting)}`;

  return (
    <footer
      style={{
        backgroundColor: "#061226",
        color: "#FFFFFF",
        borderTop: "2px solid rgba(250, 204, 21, 0.25)",
      }}
      className="w-full bg-[#061226] text-white"
    >
      <div
        style={{ paddingTop: "88px", paddingBottom: "72px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          style={{ columnGap: "56px", rowGap: "48px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Col 1: Brand & Tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{ width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" }}
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white p-1 shadow-md"
              >
                <img
                  src="/logo.png"
                  alt={dict.common.logoAlt}
                  width={40}
                  height={40}
                  style={{
                    width: "40px",
                    height: "40px",
                    maxWidth: "40px",
                    maxHeight: "40px",
                    objectFit: "contain",
                    display: "block",
                  }}
                  className="object-contain"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{ color: "#FACC15", fontSize: "20px", lineHeight: 1.15 }}
                  className="font-extrabold tracking-tight block"
                >
                  TRAVEL RWANDA
                </span>
              </div>
            </div>

            <p
              style={{ color: "#FFFFFF", fontSize: "14px", lineHeight: 1.8 }}
              className="text-white"
            >
              {dict.footer.description}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h4
              style={{
                color: "#FACC15",
                fontSize: "13px",
                letterSpacing: "0.18em",
                marginBottom: "24px",
              }}
              className="font-extrabold uppercase"
            >
              {dict.footer.navHeading}
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                fontSize: "15px",
                lineHeight: 1.5,
              }}
              className="text-white font-medium"
            >
              <li>
                <Link href="/fleet" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
                  {dict.footer.links.ourFleet}
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
                  {dict.footer.links.servicesOverview}
                </Link>
              </li>
              <li>
                <Link href="/airport-transfers" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
                  {dict.footer.links.airportTransfers}
                </Link>
              </li>
              <li>
                <Link href="/events" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
                  {dict.footer.links.events}
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
                  {dict.footer.links.aboutTravelRwanda}
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
                  {dict.footer.links.contactLocation}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contacts & Location */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h4
              style={{
                color: "#FACC15",
                fontSize: "13px",
                letterSpacing: "0.18em",
                marginBottom: "24px",
              }}
              className="font-extrabold uppercase"
            >
              {dict.footer.enquiriesHeading}
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}
                className="text-white"
              >
                <MapPin
                  style={{ color: "#FACC15", marginTop: "3px" }}
                  className="h-4 w-4 shrink-0"
                />
                <span style={{ color: "#FFFFFF" }}>
                  {dict.common.locationGahanga}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  fontSize: "15px",
                }}
                className="font-semibold"
              >
                <a
                  href="tel:+250784129579"
                  style={{
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  <Phone style={{ color: "#FACC15" }} className="h-4 w-4 shrink-0" />
                  <span>{dict.common.phonePrimary}</span>
                </a>
                <a
                  href="tel:+250781782882"
                  style={{
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  <Phone style={{ color: "#FACC15" }} className="h-4 w-4 shrink-0" />
                  <span>{dict.common.phoneSecondary}</span>
                </a>
              </div>

              <div style={{ paddingTop: "6px" }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                  }}
                  className="rounded-xl bg-[#10B981] font-bold text-white hover:bg-[#059669] shadow-sm transition-all sm:whitespace-nowrap"
                >
                  <MessageSquare className="h-4 w-4 text-white shrink-0" />
                  <span style={{ color: "#FFFFFF" }}>{dict.footer.chatWhatsapp}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Booking & Planning CTA */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h4
              style={{
                color: "#FACC15",
                fontSize: "13px",
                letterSpacing: "0.18em",
                marginBottom: "24px",
              }}
              className="font-extrabold uppercase"
            >
              {dict.footer.startRequestHeading}
            </h4>
            <p
              style={{
                color: "#FFFFFF",
                fontSize: "14px",
                lineHeight: 1.8,
                marginBottom: "24px",
              }}
              className="text-white"
            >
              {dict.footer.startRequestBody}
            </p>
            <Link
              href="/plan-your-journey"
              style={{
                backgroundColor: "#FACC15",
                color: "#061226",
                padding: "15px 28px",
                borderRadius: "12px",
                display: "inline-flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontWeight: 800,
                fontSize: "13px",
              }}
              className="w-full rounded-xl bg-[#FACC15] font-extrabold uppercase tracking-wider text-[#061226] hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
            >
              <span>{dict.footer.bookNow}</span>
              <ArrowRight className="h-4 w-4 stroke-[3] shrink-0" />
            </Link>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            marginTop: "64px",
            paddingTop: "32px",
            rowGap: "16px",
            columnGap: "32px",
            fontSize: "14px",
          }}
          className="flex flex-col sm:flex-row items-center justify-between text-white"
        >
          <p style={{ color: "#FFFFFF", lineHeight: 1.6 }} className="text-white">
            {dict.footer.copyright}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <Link href="/privacy" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
              {dict.footer.privacyPolicy}
            </Link>
            <Link href="/terms" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
              {dict.footer.bookingTerms}
            </Link>
            <Link href="/admin" style={{ color: "#FFFFFF" }} className="text-white hover:opacity-80 transition-opacity">
              {dict.footer.staffPortal}
            </Link>
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
