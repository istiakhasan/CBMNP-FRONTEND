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
}

const GbLoginInput = ({
  name,
  type,
  size = "large",
  value,
  id,
  placeholder,
  validation,
  label,
  required,
}: IInput) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);
  const modifyPlaceholder=errorMessage?errorMessage:placeholder
  return (
    <>
      {required ? (
        <span
          style={{
            color: "red",
          }}
        >
          *
        </span>
      ) : null}
      <div className="flex justify-between">
        {label ? <span className="mb-2">{label}</span> : null}
        {errorMessage ? <span className="text-[#EB2B2B] text-[12px]">{errorMessage}</span> : null}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          type === "password" ? (
            <Input.Password
              type={type}
              size={size}
              className="login_input"
              style={
                errorMessage?{ borderRadius: "4px", padding: "18px",background: "#FADADA",fontSize:"16px"}:
                { borderRadius: "4px", padding: "18px",fontSize:"16px",background:"#f6f6f6",border:"none" }
              }
              placeholder={modifyPlaceholder}
              {...field}
              value={value ? value : field.value}
              autoComplete="off" 
            />
          ) : (
            <Input
            className="login_input"
              autoComplete="off"
              type={type}
              size={size}
              style={
                errorMessage?{ borderRadius: "4px", padding: "18px",background: "#FADADA",fontSize:"16px" }:
                { borderRadius: "4px", padding: "18px",fontSize:"16px",background:"#f6f6f6",border:"none" }
              }
              placeholder={modifyPlaceholder}
              {...field}
              value={value ? value : field.value}
            />
          )
        }
      />
    </>
  );
};

export default GbLoginInput;
