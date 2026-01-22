"use client";

import type React from "react";
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { useController } from "react-hook-form";
import classNames from "classnames";

type Props<T extends FieldValues> = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name" | "defaultValue"
> & {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  fullWidth?: boolean;
  transform?: (nextDisplayedValue: string) => string;
  format?: (storedValue: string) => string;
};

const FormTextarea = <T extends FieldValues>({
  name,
  label,
  control,
  rules,
  className,
  fullWidth,
  transform,
  format,
  onChange,
  onBlur,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control, rules });

  const width = fullWidth ? "w-full" : "";
  const message = fieldState.error?.message;

  const stored = field.value == null ? "" : String(field.value);
  const displayed = format ? format(stored) : stored;

  return (
    <div className={classNames("flex flex-col gap-1", width)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <textarea
        {...rest}
        name={field.name}
        ref={field.ref}
        value={displayed}
        onChange={(e) => {
          const nextDisplayed = e.target.value;
          const nextStored = transform
            ? transform(nextDisplayed)
            : nextDisplayed;

          field.onChange(nextStored);
          onChange?.(e);
        }}
        onBlur={(e) => {
          field.onBlur();
          onBlur?.(e);
        }}
        className={classNames(
          "mt-2 w-full min-h-[140px] rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          message ? "border-red-500" : "border-border",
          className,
        )}
      />

      {message && (
        <p className="text-xs text-red-500 mt-1 leading-tight">{message}</p>
      )}
    </div>
  );
};

export default FormTextarea;
