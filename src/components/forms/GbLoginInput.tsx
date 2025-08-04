"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { getErrorMessageByPropertyName } from "@/util/schema-validator";

interface CustomLoginInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password";
  required?: boolean;
}

const CustomLoginInput = ({
  name,
  label,
  placeholder = "",
  type = "text",
  required = false,
}: CustomLoginInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const errorMessage = getErrorMessageByPropertyName(errors, name);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={inputType}
              autoComplete="off"
              placeholder={placeholder}
              className={`w-full px-4 py-3  rounded-md border transition duration-200 focus:outline-none focus:ring-2 ${
                errorMessage
                  ? "border-red-500 bg-red-50 focus:ring-red-400"
                  : "border-gray-300 bg-gray-50 focus:ring-[#248095]"
              }`}
            />
          )}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomLoginInput;
