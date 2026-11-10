import React from "react";
import { repository } from "@/lib/repository";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n/server";

export async function JsonLdSchema({ locale }: { locale?: Locale } = {}) {
  const activeLocale = locale ?? (await getServerLocale());
  const dict = getDictionary(activeLocale);
  const settings = repository.getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://travelrwanda.rw";

  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: dict.metadata.jsonLdName,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    description: dict.metadata.jsonLdDescription,
    url: siteUrl,
    inLanguage: activeLocale,
    telephone: [settings.phonePrimary, settings.phoneSecondary].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gahanga Center",
      addressLocality: "Kicukiro",
      addressRegion: "Kigali",
      addressCountry: "RW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.9804,
      longitude: 30.1062,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "21:00",
      },
    ],
    priceRange: "RWF",
    areaServed: {
      "@type": "Country",
      name: "Rwanda",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
