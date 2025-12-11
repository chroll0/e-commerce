"use client";

import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "text" | "icon";
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
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-black text-black hover:bg-black hover:text-white",
    text: "bg-transparent text-black hover:underline",
    icon: "bg-transparent border border-border rounded-full hover:bg-gray-400 p-2",
  };

  const sizeStyles = {
    sm: iconOnly ? "p-2 text-sm" : "px-3 py-1.5 text-sm",
    md: iconOnly ? "p-3 text-base" : "px-4 py-2 text-base",
    lg: iconOnly ? "p-4 text-lg" : "px-6 py-3 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={classNames(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        className
      )}
      {...props}
    >
      {leftIcon && !iconOnly && (
        <span className="flex items-center">{leftIcon}</span>
      )}
      {!iconOnly && children}
      {rightIcon && !iconOnly && (
        <span className="flex items-center">{rightIcon}</span>
      )}
      {iconOnly && (leftIcon || rightIcon)}
    </button>
  );
};

export default Button;
