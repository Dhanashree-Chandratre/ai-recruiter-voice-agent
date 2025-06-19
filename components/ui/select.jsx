import React from "react";

export function Select({ value, onValueChange, onChange, children, className = "" }) {
  const handleChange = (event) => {
    // Call onValueChange if it exists, passing the selected value
    if (onValueChange) {
      onValueChange(event.target.value);
    }
    // Also call the original onChange prop for compatibility
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange} // Use our new handleChange function
      className={
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " +
        className
      }
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

// For compatibility with your usage, these are just pass-through wrappers
export const SelectTrigger = ({ children, ...props }) => <>{children}</>;
export const SelectValue = ({ placeholder }) => <option value="" disabled hidden>{placeholder}</option>;
export const SelectContent = ({ children }) => <>{children}</>; 