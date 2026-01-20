"use client";

import type React from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import classNames from "classnames";

type Props<T extends FieldValues> = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name"
> & {
  name: Path<T>;
  label?: string;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
  fullWidth?: boolean;
};

const getErrorMessage = <T extends FieldValues>(
  errors: FieldErrors<T> | undefined,
  name: Path<T>,
) => {
  if (!errors) return undefined;

  const parts = String(name).split(".");
  let current: any = errors;

  for (const key of parts) {
    current = current?.[key];
    if (!current) return undefined;
  }

  return (current?.message as string | undefined) ?? undefined;
};

const FormTextarea = <T extends FieldValues>({
  name,
  label,
  register,
  errors,
  rules,
  className,
  fullWidth,
  ...rest
}: Props<T>) => {
  const message = getErrorMessage(errors, name);
  const width = fullWidth ? "w-full" : "";

  return (
    <div className={classNames("flex flex-col gap-1", width)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <textarea
        className={classNames(
          "mt-2 w-full min-h-[140px] rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          message ? "border-red-500" : "border-border",
          className,
        )}
        {...register(name, rules)}
        {...rest}
      />

      {message && (
        <p className="text-xs text-red-500 mt-1 leading-tight">{message}</p>
      )}
    </div>
  );
};

export default FormTextarea;
