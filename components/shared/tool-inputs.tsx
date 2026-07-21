"use client";

import type { FormField, OptionControl } from "@/types/tool";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Values = Record<string, string | number | boolean>;

export function OptionControls({
  controls,
  values,
  onChange,
}: {
  controls: OptionControl[];
  values: Values;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {controls.map((c) => {
        const id = `ctrl-${c.key}`;
        if (c.type === "toggle") {
          return (
            <label
              key={c.key}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-soft"
            >
              <Switch
                id={id}
                checked={Boolean(values[c.key])}
                onCheckedChange={(v) => onChange(c.key, v)}
              />
              <span>{c.label}</span>
            </label>
          );
        }
        if (c.type === "select") {
          return (
            <div key={c.key} className="min-w-[12rem] space-y-1.5">
              <Label htmlFor={id}>{c.label}</Label>
              <Select
                id={id}
                value={String(values[c.key] ?? c.default ?? "")}
                onChange={(e) => onChange(c.key, e.target.value)}
              >
                {c.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          );
        }
        if (c.type === "number") {
          return (
            <div key={c.key} className="w-36 space-y-1.5">
              <Label htmlFor={id}>{c.label}</Label>
              <Input
                id={id}
                type="number"
                min={c.min}
                max={c.max}
                value={String(values[c.key] ?? c.default ?? "")}
                onChange={(e) => onChange(c.key, e.target.value)}
              />
            </div>
          );
        }
        // text
        return (
          <div key={c.key} className="min-w-[14rem] flex-1 space-y-1.5">
            <Label htmlFor={id}>{c.label}</Label>
            <Input
              id={id}
              placeholder={c.placeholder}
              value={String(values[c.key] ?? c.default ?? "")}
              onChange={(e) => onChange(c.key, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}

export function FormFields({
  fields,
  values,
  onChange,
}: {
  fields: FormField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `field-${f.key}`;
        const full = f.type === "textarea";
        return (
          <div
            key={f.key}
            className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}
          >
            <Label htmlFor={id}>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                id={id}
                className="min-h-[90px]"
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
              />
            ) : f.type === "select" ? (
              <Select
                id={id}
                value={values[f.key] ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
              >
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={id}
                type={f.type === "number" ? "number" : "text"}
                placeholder={f.type === "text" ? f.placeholder : undefined}
                maxLength={f.type === "text" ? f.maxLength : undefined}
                value={values[f.key] ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
              />
            )}
            {f.description && (
              <p className="text-xs text-muted-foreground">{f.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
