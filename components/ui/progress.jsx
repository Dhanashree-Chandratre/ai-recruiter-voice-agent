import React from "react";

export function Progress({ value = 0, max = 100, className = "" }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(value, max)}%` }}
      />
    </div>
  );
} 