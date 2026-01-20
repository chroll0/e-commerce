"use client";

import { FC } from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components";

type Props<T extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "defaultValue"
> & {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

const getErrorMessage = <T extends FieldValues>(
  errors: FieldErrors<T> | undefined,
  name: Path<T>,
) => {
  if (!errors) return undefined;

  // supports dot-paths like "user.email"
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
  ...rest
}: Props<T>) => {
  const message = getErrorMessage(errors, name);
  return <Input {...rest} {...register(name, rules)} error={message} />;
};

export default FormInput;
