import { InputHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
};

const Input: FC<InputProps> = ({
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  error,
  ...props
}) => {
  const baseStyles =
    "border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center";

  const sizeStyles: Record<"sm" | "md" | "lg", string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <div className={classNames("flex flex-col", widthStyles)}>
      <div
        className={classNames(
          baseStyles,
          sizeStyles[size as "sm" | "md" | "lg"],
          "gap-2",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
      >
        {leftIcon && <span className="flex items-center">{leftIcon}</span>}
        <input className="flex-1 bg-transparent outline-none" {...props} />
        {rightIcon && <span className="flex items-center">{rightIcon}</span>}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
