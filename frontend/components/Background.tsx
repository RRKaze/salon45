import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {children}
    </div>
  );
}

