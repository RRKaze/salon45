import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  marginBottom?: "mb-2" | "mb-4" | "mb-10";
}

export default function InputField({ 
  label, 
  className = "", 
  marginBottom = "mb-4",
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
    ${marginBottom} 
    text-sm 
    text-black`;

  return (
    <>
      {label && <label htmlFor={props.id} className="text-sm mb-1 text-gray-600">{label}</label>}
      <input {...props} className={`${baseStyle} ${className}`} />
    </>
  );
}
