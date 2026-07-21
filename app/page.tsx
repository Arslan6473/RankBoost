import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/features/landing/hero";
import { Stats } from "@/features/landing/stats";
import { RecentTools } from "@/features/landing/recent-tools";
import { PopularTools } from "@/features/landing/popular-tools";
import { Categories } from "@/features/landing/categories";
import { LatestTools } from "@/features/landing/latest-tools";
import { Benefits } from "@/features/landing/benefits";
import { Features } from "@/features/landing/features";
import { Testimonials } from "@/features/landing/testimonials";
import { HomeFaq } from "@/features/landing/home-faq";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <RecentTools />
      <PopularTools />
      <Categories />
      <LatestTools />
      <Benefits />
      <Features />
      <Testimonials />
      <HomeFaq />
      <CtaBanner />
    </>
  );
}
