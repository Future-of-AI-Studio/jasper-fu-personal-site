import type { Metadata } from "next";

import { PressTabs } from "../../../components/press/press-tabs";
import { PageHead } from "../../../components/site/page-head";
import { mediaCoverage } from "../../../lib/copy";

export const metadata: Metadata = {
  title: "Media Coverage and Interviews",
  description: "Interviews and coverage featuring Jasper Fu.",
};

export default function MediaCoveragePage() {
  const [featured, ...rest] = mediaCoverage;

  return (
    <PressTabs active="coverage">
      <PageHead
        eyebrow="Press"
        title="Media Coverage and Interviews"
        lede="Interviews and coverage featuring Jasper Fu, for desks that need the primary sources in one place."
      />
      {featured ? (
        <section className="band">
          <article className="card">
            <p className="eyebrow">{featured.outlet}</p>
            <h2>{featured.title}</h2>
            <p>{featured.caption}</p>
            {featured.embedUrl ? (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="embed"
                src={featured.embedUrl}
                title={featured.title}
              />
            ) : null}
            <p>
              <a className="text-link" href={featured.watchUrl}>
                {featured.kind === "video" ? "Watch on YouTube" : "Read coverage"}
              </a>
            </p>
          </article>
        </section>
      ) : null}
      <section className="band">
        <div className="card-grid">
          {rest.map((item) => (
            <article className="card" key={item.title}>
              <p className="eyebrow">{item.outlet}</p>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
              {item.embedUrl ? (
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="embed"
                  src={item.embedUrl}
                  title={item.title}
                />
              ) : null}
              <p>
                <a className="text-link" href={item.watchUrl}>
                  {item.kind === "video" ? "Watch on YouTube" : "Read coverage"}
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>
    </PressTabs>
  );
}
