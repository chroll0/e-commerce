import { FC, ReactNode } from "react";
import classNames from "classnames";
import Image from "next/image";

type CardProps = {
  title?: string;
  subtitle?: string;
  description?: string | ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  imageHeight?: number;
};

const Card: FC<CardProps> = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt = "",
  footer,
  size = "md",
  fullWidth = false,
  className,
  imageHeight = 200, // default height
}) => {
  const sizeStyles: Record<"sm" | "md" | "lg", string> = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const widthStyles = fullWidth ? "w-full" : "w-auto";

  return (
    <div
      className={classNames(
        "bg-white rounded-lg shadow-md overflow-hidden flex flex-col",
        sizeStyles[size],
        widthStyles,
        className
      )}
    >
      {imageSrc && (
        <div className="w-full relative rounded-t-lg overflow-hidden mb-2">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={imageHeight}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col gap-1">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        {description && (
          <p className="text-gray-700 text-base">{description}</p>
        )}
      </div>

      {footer && <div className="mt-3 flex justify-end gap-2">{footer}</div>}
    </div>
  );
};

export default Card;
