"use client";

import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components";

type InputProps = React.ComponentProps<typeof Input>;

type Props<T extends FieldValues> = Omit<
  InputProps,
  "name" | "defaultValue"
> & {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
  displayValue?: string;
  transform?: (nextDisplayedValue: string) => string;
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

const FormInput = <T extends FieldValues>({
  name,
  register,
  errors,
  rules,
  onChange,
  onBlur,
  displayValue,
  transform,
  ...rest
}: Props<T>) => {
  const message = getErrorMessage(errors, name);
  const reg = register(name, rules);

  return (
    <Input
      {...rest}
      {...reg}
      value={displayValue ?? (rest.value as any)}
      onChange={(e) => {
        onChange?.(e);
        if (transform) e.target.value = transform(e.target.value);
        reg.onChange(e);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        reg.onBlur(e);
      }}
      error={message}
    />
  );
};

export default FormInput;
