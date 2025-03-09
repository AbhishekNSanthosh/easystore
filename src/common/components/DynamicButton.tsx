import React, { useEffect, useState, ReactNode } from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "reset" | "button";
  style?: React.CSSProperties;
  icon?: ReactNode; // Accepts an icon component
};

const hexToRGBA = (hex: string, opacity: number) => {
  let r = 0,
    g = 0,
    b = 0;

  // Support both 6-character and 3-character HEX codes
  if (hex.startsWith("#")) {
    if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    } else if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const DynamicButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  style,
  icon, // Added icon prop
}) => {
  const [primaryColor, setPrimaryColor] = useState("#de3024"); // Default fallback color

  useEffect(() => {
    const computedColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      .trim();

    if (computedColor && /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(computedColor)) {
      setPrimaryColor(computedColor);
    }
  }, []);

  const backgroundColor = hexToRGBA(primaryColor, 0.2); // Apply 20% opacity to the primary color

  return (
    <button
      className={`flex items-center justify-center gap-2 focus:outline-none ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      type={type}
      style={{
        color: primaryColor,
        transition: "background-color 0.2s ease-in-out",
        ...style,
      }}
    >
      {icon && <span>{icon}</span>} {/* Render icon if provided */}
      {label}
    </button>
  );
};

export default DynamicButton;
