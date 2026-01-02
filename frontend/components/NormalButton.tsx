import React from "react";

interface NormalButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function NormalButton({ 
  onClick, 
  children = "Submit",
  disabled = false,
  className = ""
}: NormalButtonProps) {
  const style = `py-2 px-6 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:cursor-not-allowed cursor-pointer ${className}`;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={style}
    >
      {children}
    </button>
  );
}

