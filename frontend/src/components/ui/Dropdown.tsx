"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import classNames from "classnames";
import Button from "./Button";
import { ChevronDown } from "lucide-react";

type DropdownItem<T = unknown> = {
  label: string;
  value: string | number;
  data?: T;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
};

type DropdownProps<T = unknown> = {
  items: DropdownItem<T>[];
  onSelect?: (item: DropdownItem<T>) => void;
  buttonLabel: string | ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
};

const Dropdown = <T,>({
  items,
  onSelect,
  buttonLabel,
  size = "md",
  fullWidth = false,
  className,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        variant="outline"
        fullWidth={fullWidth}
        rightIcon={<ChevronDown className="w-4 h-4 ml-1" />}
        className={classNames("text-secondary", className)}
      >
        {buttonLabel}
      </Button>

      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-auto">
          {items.map((item) => (
            <li
              key={item.value}
              className={classNames(
                "flex items-center justify-between px-3 py-2 hover:bg-foreground text-secondary hover:text-card cursor-pointer text-sm rounded",
                item.disabled && "opacity-50 cursor-not-allowed",
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
