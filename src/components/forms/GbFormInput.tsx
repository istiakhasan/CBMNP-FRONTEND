"use client";
import { getErrorMessageByPropertyName } from "@/util/schema-validator";
import { Input } from "antd";
import { useFormContext, Controller } from "react-hook-form";
interface IInput {
  name: string;
  type?: string;
  size?: "large" | "small";
  value?: string | string[] | undefined;
  id?: string;
  placeholder?: string;
  validation?: object;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  cl?: any;
  trigger?: (name: string) => void; // Add trigger prop
}

const GbFormInput = ({
  name,
  type,
  size = "large",
  value,
  id = name, // Set id to name by default if not provided
  placeholder,
  validation,
  label,
  required,
  disabled = false,
  cl,
  trigger,
  ...rest
}: IInput) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
      <div className="floating-label-input">
        {label && (
          <label htmlFor={name} className="text-[#999] text-[12px]">
            {required && (
              <span
                style={{
                  color: "red",
                }}
              >
                *
              </span>
            )}
            {label}
          </label>
        )}
        <Controller
          control={control}
          name={name}
          defaultValue={value || ""}
          render={({ field }) => (
            <Input
              id={name} // Add id here
              autoFocus
              disabled={disabled}
              autoComplete="off"
              type={type}
              size={size}
              style={
                errorMessage
                  ? {}
                  : {
                      boxShadow: "none",
                      border: "none",
                    }
              }
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
              {...rest}
              onChange={(e) => {
                field.onChange(e);
                if (trigger) {
                  trigger(name);
                }
              }}
            />
          )}
        />
      </div>
      {/* <small style={{ color: "red" }}>{errorMessage}</small> */}
    </>
  );
};

export default GbFormInput;
