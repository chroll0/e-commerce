import { FC, useState, ReactNode, useRef, useEffect } from "react";
import classNames from "classnames";
import Button from "./Button";

type DropdownItem = {
  label: string;
  value: string | number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
};

type DropdownProps = {
  items: DropdownItem[];
  onSelect?: (item: DropdownItem) => void;
  buttonLabel: string | ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
};

const Dropdown: FC<DropdownProps> = ({
  items,
  onSelect,
  buttonLabel,
  size = "md",
  fullWidth = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        size={size}
        fullWidth={fullWidth}
        rightIcon={<span className="ml-2">&#9662;</span>} // down arrow
        className={className}
      >
        {buttonLabel}
      </Button>

      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
          {items.map((item) => (
            <li
              key={item.value}
              className={classNames(
                "flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (!item.disabled && onSelect) {
                  onSelect(item);
                  setIsOpen(false);
                }
              }}
            >
              <div className="flex items-center gap-2">
                {item.leftIcon && <span>{item.leftIcon}</span>}
                <span>{item.label}</span>
              </div>
              {item.rightIcon && <span>{item.rightIcon}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
