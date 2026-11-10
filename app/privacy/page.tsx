import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/shared/page-header";
import { Prose } from "@/components/shared/prose";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How RankBoost handles your data. Spoiler: the tools run in your browser and we don't collect your content.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="Last updated: July 20, 2026"
        crumbs={[{ name: "Privacy Policy", path: "/privacy" }]}
      />
      <section className="container-page py-10">
        <Prose>
          <p>
            Your privacy matters to us. This policy explains what data{" "}
            {siteConfig.name} collects and how it is used. In short: the
            deterministic tools on this site run entirely in your browser, and we
            never receive the text you analyze.
          </p>

          <h2>Content you enter into tools</h2>
          <p>
            All text, SEO and readability tools process your input locally in
            your browser. <strong>Your content is never uploaded, stored or
            transmitted to our servers.</strong> When you close the tab, that
            data is gone.
          </p>

          <h2>Local storage</h2>
          <p>
            To improve your experience, we store a few preferences in your
            browser&apos;s local storage — your theme choice, favorite tools,
            recently used tools and recent copy history. This information never
            leaves your device and can be cleared at any time by clearing your
            browser data.
          </p>

          <h2>Analytics</h2>
          <p>
            We may use privacy-respecting, aggregate analytics to understand
            which tools are popular. This data is anonymized and cannot be used
            to identify you.
          </p>

          <h2>AI tools</h2>
          <p>
            The AI tools currently run on a built-in demo and process input
            locally. If a real AI provider is connected in the future, this
            policy will be updated to describe how those requests are handled.
          </p>

          <h2>Cookies</h2>
          <p>
            See our <a href="/cookies">Cookie Policy</a> for details on the
            minimal cookies and local storage we use.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </Prose>
      </section>
    </>
  );
}
