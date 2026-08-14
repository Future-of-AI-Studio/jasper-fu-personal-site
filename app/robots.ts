import type { MetadataRoute } from "next";

import { isGateEnabled } from "../lib/gate";
import { identity } from "../lib/identity";

export default function robots(): MetadataRoute.Robots {
  if (isGateEnabled()) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${identity.siteUrl}/sitemap.xml`,
    host: identity.siteUrl,
  };
}
