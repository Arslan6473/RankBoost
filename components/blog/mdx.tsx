import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { slugify } from "@/lib/utils";

const components = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      id={typeof props.children === "string" ? slugify(props.children) : undefined}
      className="mt-10 scroll-mt-24 text-2xl font-bold tracking-tight"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      id={typeof props.children === "string" ? slugify(props.children) : undefined}
      className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-4 leading-relaxed text-muted-foreground" {...props} />
  ),
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const internal = href.startsWith("/");
    if (internal) {
      return (
        <Link
          href={href}
          className="font-medium text-primary underline-offset-4 hover:underline"
          {...props}
        />
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline-offset-4 hover:underline"
        {...props}
      />
    );
  },
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-4 space-y-2 pl-5 text-muted-foreground marker:text-primary [&>li]:list-disc" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-4 border-primary bg-secondary/50 py-1 pl-5 pr-4 italic text-foreground"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
    />
  );
}
