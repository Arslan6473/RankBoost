"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(10, "Tell us a little more (10+ characters)"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    // Placeholder — wire up to your email API / form backend later.
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-10 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <h3 className="text-lg font-semibold">Message sent!</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you within 1–2
          business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Jane Doe" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="How can we help?"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell us what's on your mind…"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
        <Send />
      </Button>
    </form>
  );
}
