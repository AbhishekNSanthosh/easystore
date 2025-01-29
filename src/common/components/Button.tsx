import React from 'react';

type ButtonProps = {
  label: string;             // Button text
  onClick?: () => void;      // Optional click handler
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';  // Color variation
  size?: 'small' | 'medium' | 'large';  // Button size
  disabled?: boolean;        // Disable the button
  className:string;
};

const CustomButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  color = 'white', // Default color is primary
  size = 'medium',   // Default size is medium
  disabled = false,  // Default is not disabled
  className
}) => {

  return (
    <button
      className={`rounded-md focus:outline-none ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default CustomButton;
