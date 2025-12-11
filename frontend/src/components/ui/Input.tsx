"use client";

import { InputHTMLAttributes, FC, ReactNode, useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import classNames from "classnames";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  passwordToggle?: boolean;
};

const Input: FC<InputProps> = ({
  label,
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  error,
  passwordToggle = false,
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseStyles =
    "border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center";

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <div className={classNames("flex flex-col gap-1", widthStyles)}>
      {label && (
        <label className="text-sm font-medium text-secondary">{label}</label>
      )}
      <div
        className={classNames(
          baseStyles,
          sizeStyles[size as "sm" | "md" | "lg"],
          "gap-2",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
      >
        {leftIcon && <span>{leftIcon}</span>}

        <input
          className="flex-1 bg-transparent outline-none"
          type={passwordToggle ? (showPassword ? "text" : "password") : type}
          {...props}
        />

        {/* Password Toggle Button */}
        {passwordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeClosed /> : <EyeIcon />}
          </button>
        )}

        {!passwordToggle && rightIcon && <span>{rightIcon}</span>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
