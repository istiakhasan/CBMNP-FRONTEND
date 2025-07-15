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
  addon?: any;
  trigger?: (name: string) => void;
}

const currencyFormatter = (value: string) => {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const currencyParser = (value: string) => {
  if (!value) return "";
  return value.replace(/\$\s?|(,*)/g, "");
};

const GbBDTInput = ({
  name,
  type,
  size = "large",
  value,
  id,
  placeholder,
  validation,
  label,
  required,
  disabled = false,
  cl,
  trigger,
  addon,
  ...rest
}: IInput) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
      <div className="">
        {required && (
          <span
            style={{
              color: "red",
            }}
          >
            *
          </span>
        )}
      </div>
      <Controller
        control={control}
        name={name}
        defaultValue={value}
        render={({ field }) => (
          <div style={errorMessage && {border:"1px solid red"}} className="floating-label-input">
            <label className="text-[#999] text-[12px]">{label}</label>
            <Input
              autoFocus
              addonBefore={addon}
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
              value={value ? currencyFormatter(value as string) : currencyFormatter(field.value)}
              onChange={(e) => {
                const formattedValue = currencyParser(e.target.value);
                field.onChange(formattedValue); // Update the field value
                if (trigger) {
                  trigger(name);
                }
              }}
            />
          </div>
        )}
      />
    </>
  );
};

export default GbBDTInput;
