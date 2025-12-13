"use client";

import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
};

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none";

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
