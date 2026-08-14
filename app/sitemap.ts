import type { MetadataRoute } from "next";

import { identity } from "../lib/identity";

const routes = [
  "",
  "/about",
  "/press",
  "/press/media-coverage",
  "/speaking",
  "/media-kit",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
  "/legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${identity.siteUrl}${route}`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/press") ? 0.8 : 0.7,
  }));
}
