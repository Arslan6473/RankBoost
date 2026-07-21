import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Prose } from "@/components/shared/prose";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "How SEO Text Tools uses cookies and local storage.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <PageHeader
        title="Cookie Policy"
        description="Last updated: July 20, 2026"
        crumbs={[{ name: "Cookie Policy", path: "/cookies" }]}
      />
      <section className="container-page py-10">
        <Prose>
          <p>
            This policy explains how we use cookies and similar technologies. We
            keep this to an absolute minimum — the site works without any
            tracking cookies.
          </p>

          <h2>What we store</h2>
          <p>
            Rather than cookies, we primarily use your browser&apos;s{" "}
            <strong>local storage</strong> to remember a few preferences:
          </p>
          <ul>
            <li>Your theme preference (light or dark)</li>
            <li>Your favorite tools</li>
            <li>Your recently used tools</li>
            <li>Your recent copy history</li>
          </ul>
          <p>
            This information stays on your device and is never sent to us.
          </p>

          <h2>Analytics cookies</h2>
          <p>
            If analytics are enabled, we use privacy-friendly, aggregate
            measurement that does not track individuals across sites or store
            personally identifiable information.
          </p>

          <h2>Managing cookies and storage</h2>
          <p>
            You can clear local storage and cookies at any time through your
            browser settings. Doing so will reset your preferences but will not
            affect the functionality of the tools.
          </p>
        </Prose>
      </section>
    </>
  );
}
