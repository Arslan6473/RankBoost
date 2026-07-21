import {
  Zap,
  Shield,
  Sparkles,
  Gift,
  Gauge,
  Smartphone,
  Moon,
  Lock,
  Infinity as InfinityIcon,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: "50+", label: "Free tools" },
  { value: "100%", label: "Free forever" },
  { value: "0", label: "Signups required" },
  { value: "⚡", label: "Instant results" },
];

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  {
    icon: Zap,
    title: "Blazing fast",
    description:
      "Every tool runs instantly in your browser. No servers, no waiting, no loading spinners.",
  },
  {
    icon: Shield,
    title: "Private by design",
    description:
      "Your text never leaves your device. All analysis happens locally — nothing is uploaded.",
  },
  {
    icon: Gift,
    title: "Completely free",
    description:
      "No paywalls, no trials, no credit card. Every tool is free to use, forever.",
  },
  {
    icon: Sparkles,
    title: "AI-ready",
    description:
      "Smart AI writing tools built in, with a clean architecture ready for OpenAI or Gemini.",
  },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Gauge,
    title: "Real-time analysis",
    description: "Watch metrics update live as you type — no button clicks needed.",
  },
  {
    icon: LayoutGrid,
    title: "50+ tools in one place",
    description: "SEO, text, readability and AI tools under a single, consistent roof.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "Fully responsive and mobile-first — use it on any device.",
  },
  {
    icon: Moon,
    title: "Dark & light mode",
    description: "A beautiful interface that adapts to your system or your preference.",
  },
  {
    icon: Lock,
    title: "No tracking",
    description: "We don't need your data. Tools work offline, privately, in your browser.",
  },
  {
    icon: InfinityIcon,
    title: "Unlimited usage",
    description: "No character limits, no rate limits, no daily caps. Use it as much as you like.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "This has completely replaced the three different SEO tools I used to juggle. The readability score and SERP preview alone save me hours every week.",
    name: "Sarah Chen",
    role: "Content Marketer",
    initials: "SC",
  },
  {
    quote:
      "The cleanest, fastest text tools I've found. No ads, no clutter, no nonsense — it just works. The keyword density checker is my daily driver.",
    name: "Marcus Reid",
    role: "Freelance Writer",
    initials: "MR",
  },
  {
    quote:
      "I use the meta description generator and slug tool on every article. It's become a core part of our editorial workflow. Highly recommended.",
    name: "Priya Nair",
    role: "SEO Lead",
    initials: "PN",
  },
];

export interface HomeFaq {
  question: string;
  answer: string;
}

export const homeFaqs: HomeFaq[] = [
  {
    question: "Are these tools really free?",
    answer:
      "Yes — every tool is 100% free with no signup, no trial and no hidden limits. We believe great writing tools should be accessible to everyone.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required. Just open any tool and start using it immediately. Favorites and history are stored locally in your browser.",
  },
  {
    question: "Is my text safe and private?",
    answer:
      "Absolutely. The deterministic text and SEO tools run entirely in your browser — your content is never uploaded to a server.",
  },
  {
    question: "How accurate are the readability scores?",
    answer:
      "We use industry-standard formulas (Flesch Reading Ease, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau and ARI) and show a consensus grade for a balanced view.",
  },
  {
    question: "Can I use these tools on mobile?",
    answer:
      "Yes. The entire site is mobile-first and fully responsive, so every tool works beautifully on phones and tablets.",
  },
  {
    question: "Are the AI tools connected to a real model?",
    answer:
      "The AI tools ship with a built-in demo so they work with no API key. The code is structured so you can connect OpenAI or Gemini in a single file.",
  },
];
