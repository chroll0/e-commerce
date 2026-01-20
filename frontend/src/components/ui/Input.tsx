"use client";

import { InputHTMLAttributes, FC, ReactNode, useId, useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import classNames from "classnames";

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "size"
> & {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  success?: boolean;
  passwordToggle?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: FC<InputProps> = ({
  label,
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  error,
  success,
  passwordToggle = false,
  type,
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  const baseStyles =
    "flex items-center gap-2 bg-transparent border-b-2 transition-colors duration-200 focus-within:outline-none";

  const borderState = error
    ? "border-red-500"
    : success
      ? "border-green-500"
      : "border-border focus-within:border-blue-500";

  const sizeStyles = {
    sm: "pb-1 pt-0.5 text-sm",
    md: "pb-2 pt-1 text-base",
    lg: "pb-3 pt-1.5 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <div className={classNames("flex flex-col gap-1", widthStyles)}>
      {label && (
        <label htmlFor={inputId} className="text-md font-medium text-secondary">
          {label}
        </label>
      )}

      <div
        className={classNames(
          baseStyles,
          sizeStyles[size],
          borderState,
          className,
        )}
      >
        {leftIcon && <span className="text-secondary">{leftIcon}</span>}

        <input
          id={inputId}
          className="flex-1 bg-transparent outline-none placeholder:text-secondary"
          type={passwordToggle ? (showPassword ? "text" : "password") : type}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />

        {passwordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-secondary hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeClosed size={18} /> : <EyeIcon size={18} />}
          </button>
        )}

        {!passwordToggle && rightIcon && (
          <span className="text-secondary">{rightIcon}</span>
        )}
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-500 mt-1 leading-tight">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
