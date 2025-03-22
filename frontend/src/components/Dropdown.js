"use client";

import { useState, useRef, useEffect } from "react";

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  className = "",
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 
        dark:border-gray-600 text-left flex justify-between items-center 
        ${
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        } ${className}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={value ? "" : "text-gray-400"}>{value || label}</span>
        {!disabled && (
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        )}
      </button>

      {isOpen && !disabled && (
        <div
          className="absolute z-10 mt-1 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-sm 
          dark:bg-gray-700 max-h-60 overflow-auto"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            role="listbox"
          >
            {options.map((option) => (
              <li key={option} className="cursor-pointer">
                <button
                  type="button"
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={value === option}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {required && (
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          style={{ opacity: 0, height: 0, position: "absolute" }}
          value={value || ""}
          onChange={() => {}}
          required
          disabled={disabled}
        />
      )}
    </div>
  );
}
