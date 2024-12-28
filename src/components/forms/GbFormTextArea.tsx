"use client";
import { getErrorMessageByPropertyName } from "@/util/schema-validator";
import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

type TextAreaProps = {
  name: string;
  label?: string;
  rows?: number;
  value?: string;
  placeholder?: string;
  required?: boolean;
  cl?: any;
  size?: any;
};

const GbFormTextArea = ({
  name,
  label,
  rows,
  value,
  placeholder,
  required,
  cl,
  size="large"
}: TextAreaProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);
  return (
    <div className={`flex flex-col  w-full`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={`floating-label-input ${errorMessage?'err':''}`}>
            <label className="text-[#999] text-[12px]">{label}</label>
          <Input.TextArea
            rows={rows}
            placeholder={placeholder}
            {...field}
            defaultValue={value}
            style={
              errorMessage
                ? {
                    borderRadius: "4px",
                    padding: "12px",
                    background: "#FADADA",
                    fontSize: "16px",
                    fontWeight: "400",
                  }
                :{
                    boxShadow:"none",
                    border:"none"
                  }
            }
          />
          </div>
        )}
      />
      {/* <small style={{ color: "red" }}>{errorMessage}</small> */}
    </div>
  );
};

export default GbFormTextArea;
