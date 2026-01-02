import React from "react";

interface SubmitButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function SubmitButton({ 
  onClick, 
  children = "Submit",
  disabled = false,
  className = ""
}: SubmitButtonProps) {
  const style = `py-2 px-6 rounded-full bg-brand text-white hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`;
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

