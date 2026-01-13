"use client";

import { FC, ReactNode, useEffect } from "react";
import classNames from "classnames";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);

    // scroll lock
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles: Record<"sm" | "md" | "lg", string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/10 backdrop-blur-[5px] px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={classNames(
          "w-full overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-[0_12px_40px_var(--shadow)]",
          "animate-in fade-in zoom-in-95 duration-150",
          sizeStyles[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold">{title}</h2>
          </div>
        )}

        <div className="p-5">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-border bg-card-soft">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
