import { homeFaqs } from "@/constants/landing";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { JsonLd, faqJsonLd } from "@/components/shared/json-ld";

export function HomeFaq() {
  return (
    <section className="container-page py-16 sm:py-20">
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about the tools and how they work."
      />
      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card px-6 shadow-soft">
        <FaqAccordion faqs={homeFaqs} />
      </div>
    </section>
  );
}
