import { FC, ReactNode } from "react";
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
  if (!isOpen) return null;

  const sizeStyles: Record<"sm" | "md" | "lg", string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={classNames(
          "bg-white rounded-lg shadow-lg overflow-hidden",
          sizeStyles[size],
          "w-full mx-4",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-4 py-3 border-b border-gray-200 font-semibold text-lg">
            {title}
          </div>
        )}

        <div className="p-4">{children}</div>

        {footer && (
          <div className="px-4 py-3 border-t border-gray-200">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
