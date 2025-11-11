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
    `border border-slate-500 py-2 pl-3 rounded-full color-white active:outline-white-0 ${marginBottom} text-sm text-gray-700 hover:text-brand`;

  return (
    <div className="flex flex-col">
      {label && <label htmlFor={props.id} className="text-sm mb-1 text-gray-600">{label}</label>}
      <input {...props} className={`${baseStyle} ${className}`} />
    </div>
  );
}
