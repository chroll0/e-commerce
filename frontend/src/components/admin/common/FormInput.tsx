"use client";

import React from "react";
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { useController } from "react-hook-form";
import { Input } from "@/components";

type InputProps = React.ComponentProps<typeof Input>;

type Props<T extends FieldValues> = Omit<
  InputProps,
  "name" | "defaultValue"
> & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  transform?: (nextDisplayedValue: string) => string;
  format?: (storedValue: string) => string;
};

const FormInput = <T extends FieldValues>({
  name,
  control,
  rules,
  transform,
  format,
  onChange,
  onBlur,
  ...rest
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control, rules });

  const stored = field.value == null ? "" : String(field.value);
  const displayed = format ? format(stored) : stored;

  return (
    <Input
      {...rest}
      name={field.name}
      ref={field.ref}
      value={displayed}
      onChange={(e) => {
        const nextDisplayed = e.target.value;
        const nextStored = transform ? transform(nextDisplayed) : nextDisplayed;

        field.onChange(nextStored);
        onChange?.(e);
      }}
      onBlur={(e) => {
        field.onBlur();
        onBlur?.(e);
      }}
      error={fieldState.error?.message}
    />
  );
};

export default FormInput;
