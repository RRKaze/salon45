import React from "react";

interface SubmitButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function SubmitButton({ 
  onClick, 
  children = "Submit",
  disabled = false 
}: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-sm px-4 py-2 rounded-full bg-brand text-white hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed mt-10"
    >
      {children}
    </button>
  );
}

