"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    // Placeholder — wire up to your ESP (Mailchimp, Resend, etc.) later.
    await new Promise((r) => setTimeout(r, 600));
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <CheckCircle2 className="size-4" />
        You&apos;re subscribed! Watch your inbox for new tools & guides.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
      <div className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <Input
          type="email"
          placeholder="you@example.com"
          aria-label="Email address"
          {...register("email")}
        />
        <Button type="submit" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? "…" : "Subscribe"}
          <ArrowRight />
        </Button>
      </div>
      {errors.email && (
        <p className="text-xs text-destructive">{errors.email.message}</p>
      )}
    </form>
  );
}
