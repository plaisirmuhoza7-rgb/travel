import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://travelrwanda.rw";

  const staticRoutes = [
    "",
    "/fleet",
    "/vehicles",
    "/services",
    "/services/car-rental",
    "/services/airport-transfer",
    "/services/wedding-event",
    "/services/group-transport",
    "/services/corporate-transport",
    "/airport-transfers",
    "/events",
    "/plan-your-journey",
    "/about",
    "/contact",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
