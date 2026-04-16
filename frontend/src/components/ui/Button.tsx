"use client";

import classNames from "classnames";
import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "text";
  size?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
};

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  children,
  asChild = false,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";

  const baseStyles =
    "font-medium rounded transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 capitalize disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-primary text-background hover:opacity-90",
    secondary: "bg-card-soft text-foreground hover:bg-muted",
    tertiary: "bg-primary/20 text-foreground hover:bg-muted",
    outline: "border border-border text-foreground hover:bg-card-soft",
    text: "bg-transparent text-foreground hover:underline",
  };

  const sizeStyles = {
    xs: iconOnly ? "p-1 text-xs" : "px-2 py-2 text-xs",
    sm: iconOnly ? "p-1.5 text-sm" : "px-3 py-1.5 text-sm",
    md: iconOnly ? "p-3 text-base" : "px-4 py-2 text-base",
    lg: iconOnly ? "p-4 text-lg" : "px-6 py-3 text-lg",
  };

  if (asChild) {
    return (
      <Comp
        className={classNames(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <button
      className={classNames(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leftIcon && !iconOnly && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && !iconOnly && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
