"use client";

import { useState, useRef, useEffect } from "react";

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const loadOptions = async () => {
      if (typeof options === "function") {
        setIsLoading(true);
        try {
          const loadedOptions = await options();
          setDropdownOptions(Array.isArray(loadedOptions) ? loadedOptions : []);
        } catch (error) {
          console.error("Error loading dropdown options:", error);
          setDropdownOptions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setDropdownOptions(Array.isArray(options) ? options : []);
      }
    };

    loadOptions();
  }, [options]);


  useEffect(() => {
    if (value && dropdownOptions.length > 0) {
      const option = dropdownOptions.find(
        (opt) => opt.value === value || opt === value
      );
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, dropdownOptions]);

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

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(typeof option === "object" ? option.value : option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className={`flex justify-between items-center w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
          disabled ? "bg-gray-100 text-gray-500" : ""
        }`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span>
          {isLoading
            ? "Loading options..."
            : selectedOption
            ? typeof selectedOption === "object"
              ? selectedOption.label
              : selectedOption
            : label}
        </span>
        <span>▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">
              Loading options...
            </div>
          ) : dropdownOptions.length > 0 ? (
            dropdownOptions.map((option, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {typeof option === "object" ? option.label : option}
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              No options available
            </div>
          )}
        </div>
      )}

{/* I hid this form sub */}
      <input
        type="hidden"
        name={label}
        value={value || ""}
        required={required}
      />
    </div>
  );
}
