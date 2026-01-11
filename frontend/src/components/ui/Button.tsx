"use client";

import classNames from "classnames";
import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  asChild?: boolean;
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
    "font-medium rounded transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

  const variantStyles = {
    primary: "bg-primary text-background hover:opacity-90",
    secondary: "bg-card-soft text-foreground hover:bg-muted",
    outline: "border border-border text-foreground hover:bg-card-soft",
    text: "bg-transparent text-foreground hover:underline",
  };

  const sizeStyles = {
    sm: iconOnly ? "p-2 text-sm" : "px-3 py-1.5 text-sm",
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
          className
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
        className
      )}
      {...props}
    >
      {leftIcon && !iconOnly && <span>{leftIcon}</span>}
      {!iconOnly && children}
      {rightIcon && !iconOnly && <span>{rightIcon}</span>}
      {iconOnly && (leftIcon || rightIcon)}
    </button>
  );
};

export default Button;
