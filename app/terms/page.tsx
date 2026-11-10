import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/shared/page-header";
import { Prose } from "@/components/shared/prose";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of RankBoost.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        description="Last updated: July 20, 2026"
        crumbs={[{ name: "Terms of Service", path: "/terms" }]}
      />
      <section className="container-page py-10">
        <Prose>
          <p>
            By accessing and using {siteConfig.name} (the &quot;Service&quot;),
            you agree to these Terms of Service. If you do not agree, please do
            not use the Service.
          </p>

          <h2>Use of the Service</h2>
          <p>
            The Service is provided free of charge for personal and commercial
            use. You may use the tools for any lawful purpose. You agree not to
            misuse the Service, attempt to disrupt it, or use it to violate any
            applicable law.
          </p>

          <h2>No warranty</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any
            kind. While we strive for accuracy, readability scores, keyword
            metrics and AI outputs are estimates and should be used as guidance,
            not absolute truth. You are responsible for reviewing and verifying
            any output before relying on it.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, {siteConfig.name} shall not
            be liable for any indirect, incidental or consequential damages
            arising from your use of the Service.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The Service&apos;s design, branding and original content are the
            property of {siteConfig.name}. Content you enter and results you
            generate belong to you.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            Service after changes constitutes acceptance of the new terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </Prose>
      </section>
    </>
  );
}
