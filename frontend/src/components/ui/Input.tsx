import { InputHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
};

const Input: FC<InputProps> = ({
  label,
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  error,
  ...props
}) => {
  const baseStyles =
    "border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-highlight flex items-center bg-card-soft text-primary";

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
          "gap-2 border-border-strong",
          error && "border-accent!",
          className
        )}
      >
        {leftIcon && <span>{leftIcon}</span>}
        <input
          className="flex-1 bg-transparent outline-none text-primary placeholder:text-muted"
          {...props}
        />
        {rightIcon && <span>{rightIcon}</span>}
      </div>

      {error && <p className="text-accent text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
