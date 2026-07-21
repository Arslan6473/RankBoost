import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/features/contact/contact-form";
import { Card } from "@/components/ui/card";
import { GithubIcon } from "@/components/shared/social-icons";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the SEO Text Tools team. Questions, feedback and tool requests welcome.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Get in touch"
        description="Have a question, some feedback, or a tool you'd love to see? We'd genuinely like to hear from you."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <ContactForm />
        </Card>

        <div className="space-y-4">
          <Card className="flex items-start gap-3 p-5">
            <Mail className="mt-0.5 size-5 text-primary" />
            <div>
              <div className="text-sm font-semibold">Email us</div>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {siteConfig.email}
              </a>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <MessageSquare className="mt-0.5 size-5 text-primary" />
            <div>
              <div className="text-sm font-semibold">Feedback</div>
              <p className="text-sm text-muted-foreground">
                Tool requests and ideas are always welcome — we build based on
                what people ask for.
              </p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <GithubIcon className="mt-0.5 size-5 text-primary" />
            <div>
              <div className="text-sm font-semibold">Open source</div>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Report issues on GitHub
              </a>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
