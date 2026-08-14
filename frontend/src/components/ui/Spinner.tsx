"use client";

import classNames from "classnames";

type Props = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

export default function Spinner({ size = "sm", className }: Props) {
  const sizeClasses = {
    xs: "h-3 w-3 border",
    sm: "h-4 w-4 border",
    md: "h-5 w-5 border-2",
    lg: "h-6 w-6 border-2",
  };

  return (
    <div
      className={classNames(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="loading"
    />
  );
}
