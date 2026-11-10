import type { Metadata } from "next";
import { Zap, Shield, Heart, Target } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { allTools } from "@/lib/tools/registry";
import { PageHeader } from "@/components/shared/page-header";
import { Prose } from "@/components/shared/prose";
import { Card } from "@/components/ui/card";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "RankBoost is a free collection of fast, private, beautifully designed SEO and text-analysis tools.",
  path: "/about",
});

const values = [
  { icon: Zap, title: "Fast", description: "Every tool runs instantly in your browser — no waiting." },
  { icon: Shield, title: "Private", description: "Your text stays on your device. We don't store or track it." },
  { icon: Heart, title: "Free", description: "No paywalls, no signups, no limits. Free forever." },
  { icon: Target, title: "Focused", description: "Clean, distraction-free tools that do one job well." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About RankBoost"
        description="A free toolkit built for writers, marketers and SEOs who value speed, privacy and clean design."
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <section className="container-page py-10">
        <Prose>
          <p>
            <strong>RankBoost</strong> started with a simple frustration:
            the best free SEO and text tools were buried under ads, popups and
            clunky interfaces. We wanted something faster, cleaner and genuinely
            pleasant to use — so we built it.
          </p>
          <p>
            Today the site offers <strong>{allTools.length}+ free tools</strong>{" "}
            spanning SEO, text manipulation, readability analysis and AI-assisted
            writing. Every deterministic tool runs entirely in your browser,
            which means your content is never uploaded to a server — and results
            appear the instant you type.
          </p>
          <h2>Our mission</h2>
          <p>
            We believe great writing and SEO tools should be accessible to
            everyone, for free. No accounts, no trials, no dark patterns — just
            fast, useful tools that respect your time and your privacy.
          </p>
        </Prose>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <Card key={v.title} className="p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {v.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
