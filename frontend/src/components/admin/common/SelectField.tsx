"use client";

import { FC } from "react";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

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
};

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
}) => {
  return (
    <div className="w-full relative">
      <label className="text-xs font-medium text-secondary">{label}</label>

      <div className="relative mt-2">
        <div
          className={[
            "relative flex items-center gap-2 bg-transparent border-b-2 transition-colors duration-200",
            error
              ? "border-destructive"
              : "border-border focus-within:border-blue-500",
          ].join(" ")}
        >
          <select
            name={name}
            value={value}
            onChange={(e) => onChange(String(e.target.value ?? ""))}
            disabled={disabled}
            className={[
              "w-full bg-card outline-none appearance-none pr-10",
              "pb-2 text-base",
              "text-secondary",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            <option value="">{placeholderLabel}</option>

            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>

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
