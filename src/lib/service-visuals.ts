import type { StaticImageData } from "next/image";
import keyImg from "../../public/key.png";
import airportImg from "../../public/airport.png";
import manypImg from "../../public/manyp.png";
import hiaceImg from "../../public/hiace.png";
import coastersImg from "../../public/coasters.png";
import suvImg from "../../public/suv.png";

export interface ServiceVisual {
  image: StaticImageData;
  publicPath: string;
  alt: string;
  badge: string;
  fleetTag: string;
  highlights: string[];
  accentTone: "navy" | "green";
}

const SERVICE_VISUALS_BY_SLUG: Record<string, ServiceVisual> = {
  "car-rental": {
    image: keyImg,
    publicPath: "/key.png",
    alt: "Car rental key handover in front of a black luxury SUV in Kigali",
    badge: "Daily & Multi-Day",
    fleetTag: "SUVs · Sedans · 4x4",
    highlights: [
      "Kigali city & upcountry routes",
      "Inspected vehicles & clear agreements",
    ],
    accentTone: "navy",
  },
  "airport-transfer": {
    image: airportImg,
    publicPath: "/airport.png",
    alt: "Executive vehicle ready for Kigali International Airport arrival pickup",
    badge: "24/7 KGL Arrivals",
    fleetTag: "Flight Tracked · Meet & Greet",
    highlights: [
      "Live KGL flight delay monitoring",
      "Terminal greeting & luggage care",
    ],
    accentTone: "green",
  },
  "wedding-event": {
    image: manypImg,
    publicPath: "/manyp.png",
    alt: "Coordinated luxury SUV and sedan fleet for weddings and ceremonies",
    badge: "Bridal & VIP Fleet",
    fleetTag: "Prado TXL · U8 · K5",
    highlights: [
      "Gusaba & bridal convoy timing",
      "Optional guest Coaster shuttles",
    ],
    accentTone: "navy",
  },
  "group-transport": {
    image: hiaceImg,
    publicPath: "/hiace.png",
    alt: "Silver Toyota HiAce passenger van for group and family travel in Rwanda",
    badge: "Group & Family Vans",
    fleetTag: "14-Seat HiAce · Vans",
    highlights: [
      "Spacious seating & luggage bay",
      "Built for delegations & reunions",
    ],
    accentTone: "green",
  },
  "corporate-transport": {
    image: coastersImg,
    publicPath: "/coasters.png",
    alt: "Lineup of white Toyota Coaster minibuses for corporate events and summits",
    badge: "Summits & Delegations",
    fleetTag: "Coaster Fleet · Protocol",
    highlights: [
      "Synchronized venue shuttles",
      "Dedicated dispatch coordinator",
    ],
    accentTone: "navy",
  },
};

const ORDERED_VISUALS: ServiceVisual[] = [
  SERVICE_VISUALS_BY_SLUG["car-rental"],
  SERVICE_VISUALS_BY_SLUG["airport-transfer"],
  SERVICE_VISUALS_BY_SLUG["wedding-event"],
  SERVICE_VISUALS_BY_SLUG["group-transport"],
  SERVICE_VISUALS_BY_SLUG["corporate-transport"],
];

export function getServiceVisual(slug: string, index = 0): ServiceVisual {
  if (SERVICE_VISUALS_BY_SLUG[slug]) {
    return SERVICE_VISUALS_BY_SLUG[slug];
  }
  if (ORDERED_VISUALS[index]) {
    return ORDERED_VISUALS[index];
  }
  return {
    image: suvImg,
    publicPath: "/suv.png",
    alt: "Travel Rwanda ground transport service vehicle",
    badge: "Transport Service",
    fleetTag: "Verified Fleet",
    highlights: [
      "24/7 dispatch support",
      "Clear quoting before travel",
    ],
    accentTone: index % 2 === 0 ? "navy" : "green",
  };
}
