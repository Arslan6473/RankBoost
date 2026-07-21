import Link from "next/link";
import { footerNav } from "@/constants/nav";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { GithubIcon, XIcon } from "@/components/shared/social-icons";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border bg-secondary/30">
      {/* Newsletter */}
      <div className="container-page py-12">
        <div className="grid gap-8 rounded-2xl border border-border bg-card p-8 shadow-soft lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              Get new tools & SEO tips
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Join our newsletter. New tools, product updates and practical SEO
              advice — no spam, unsubscribe anytime.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Links */}
      <div className="container-page grid gap-10 border-t border-border py-12 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={`https://twitter.com/${siteConfig.twitter.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <XIcon className="size-4" />
            </a>
          </div>
        </div>

        {footerNav.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built for speed, privacy and clean writing.</p>
        </div>
      </div>
    </footer>
  );
}
