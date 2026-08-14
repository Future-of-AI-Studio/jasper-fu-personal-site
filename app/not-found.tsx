import Link from "next/link";

import { PageHead } from "../components/site/page-head";

export default function NotFoundPage() {
  return (
    <article>
      <PageHead
        eyebrow="Not found"
        title="This page isn't here."
        lede="The press site may have moved the URL. Start from home."
      >
        <Link className="button-link" href="/">
          Back to home
        </Link>
      </PageHead>
    </article>
  );
}
