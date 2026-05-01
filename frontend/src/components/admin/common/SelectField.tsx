"use client";

import { FC, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SelectOption } from "@/types";

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: SelectOption[];
  placeholderLabel: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  name?: string;
  labelIcon?: ReactNode;
};

function stripTreePrefix(s: string) {
  return s
    .replace(/^[\s\u00A0]*(?:[└├]─\s*)/g, "")
    .replace(/^(?:—\s*)+/g, "")
    .trim();
}

const SelectField: FC<Props> = ({
  label,
  value,
  onChange,
  options,
  placeholderLabel,
  disabled = false,
  error,
  hint,
  name,
  labelIcon,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const selectedText =
    value && selected
      ? (selected.cleanLabel ?? stripTreePrefix(selected.label))
      : placeholderLabel;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handlePick = (v: string, isDisabled?: boolean) => {
    if (disabled || isDisabled) return;
    onChange(v);
    setOpen(false);
  };

  const borderClass = error
    ? "border-red-500"
    : open
      ? "border-blue-500"
      : "border-border";

  return (
    <div ref={rootRef} className="w-full relative">
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <label className="inline-flex items-center gap-2 text-xs font-medium text-secondary">
        {labelIcon ? (
          <span className="text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
            {labelIcon}
          </span>
        ) : null}
        <span>{label}</span>
      </label>

      <div className="relative mt-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={[
            "relative w-full text-left bg-card outline-none",
            "pb-2 pr-10",
            "border-b-2 transition-colors duration-200",
            borderClass,
            "focus-visible:outline-none",
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
            value ? "text-secondary" : "text-muted-foreground",
          ].join(" ")}
        >
          <span className="text-base">{selectedText}</span>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </button>

        {open && !disabled && (
          <div
            className={[
              "absolute z-50 mt-2 w-full",
              "rounded-xl border border-border bg-card shadow-lg",
              "max-h-72 overflow-auto",
            ].join(" ")}
          >
            <div
              className="px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => handlePick("")}
            >
              {placeholderLabel}
            </div>

            <div className="h-px bg-border" />

            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handlePick(opt.value, opt.disabled)}
                className={[
                  "px-3 py-0.5 text-sm",
                  opt.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-muted/50",
                  opt.value === value ? "bg-muted/40" : "",
                ].join(" ")}
                title={opt.cleanLabel ?? stripTreePrefix(opt.label)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}

        {error ? (
          <p className="mt-1 text-xs text-destructive leading-tight">{error}</p>
        ) : null}

        {hint ? (
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </div>
  );
};

export default SelectField;
