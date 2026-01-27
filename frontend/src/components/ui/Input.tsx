"use client";

import React, { InputHTMLAttributes, ReactNode, useId, useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import classNames from "classnames";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  success?: boolean;
  passwordToggle?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;

    const borderState = error
      ? "border-red-500"
      : success
        ? "border-green-500"
        : "border-border focus-within:border-blue-500";

    const widthStyles = fullWidth ? "w-full" : "";

    const sizeStyles = {
      sm: { wrap: "py-1", input: "pt-4 pb-1 text-sm", label: "text-xs" },
      md: { wrap: "py-1.5", input: "pt-2 pb-1 text-base", label: "text-sm" },
      lg: { wrap: "py-2", input: "pt-6 pb-3 text-lg", label: "text-md" },
    }[size];

    return (
      <div className={classNames("flex flex-col gap-1", widthStyles)}>
        <div
          className={classNames(
            "relative flex items-center gap-2 bg-transparent border-b-2 transition-colors duration-200",
            sizeStyles.wrap,
            borderState,
            className,
          )}
        >
          {leftIcon && <span className="text-secondary">{leftIcon}</span>}

          <input
            ref={ref}
            id={inputId}
            className={classNames(
              "peer flex-1 bg-transparent outline-none text-foreground",
              label
                ? "placeholder:text-transparent"
                : "placeholder:text-muted-foreground",
              sizeStyles.input,
            )}
            placeholder={label ? " " : (props.placeholder ?? "")}
            type={passwordToggle ? (showPassword ? "text" : "password") : type}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />

          {label && (
            <label
              htmlFor={inputId}
              className={classNames(
                "pointer-events-none absolute left-0",
                leftIcon ? "ml-7" : "ml-0",
                "text-secondary transition-all duration-200",
                "top-1/2 -translate-y-1/2",
                "peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-foreground",
                "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
                sizeStyles.label,
              )}
            >
              {label}
            </label>
          )}

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
  },
);

Input.displayName = "Input";
export default Input;
