import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function InputField({ 
  label, 
  className = "", 
  ...props 
}: InputFieldProps) {
  const baseStyle =
    `border 
    border-slate-500 
    shadow-lg 
    p-3 
    rounded-md 
    focus-visible:outline-(--color-brand)
    focus-visible:outline-2
    focus-visible:placeholder:font-semibold
    hover:placeholder:font-semibold
    hover:opacity-85
    mb-4 
    text-sm 
    text-black`;

  return (
    <div className="mb-4">
      {label && <label htmlFor={props.id} className="block text-sm mb-2 text-gray-600">{label}</label>}
      <input {...props} className={`${baseStyle} ${className}`} />
    </div>
  );
}
