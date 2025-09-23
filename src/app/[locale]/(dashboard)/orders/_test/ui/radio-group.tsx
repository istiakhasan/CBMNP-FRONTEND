"use client";

import * as React from "react";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { cn } from "./utils";

type RadioGroupProps = {
  className?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

function RadioGroup({ className, value, onChange, children, disabled }: RadioGroupProps) {
  const handleChange = (e: RadioChangeEvent) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <Radio.Group
      value={value}
      onChange={handleChange}
      className={cn("flex flex-col gap-3", className)}
      disabled={disabled}
    >
      {children}
    </Radio.Group>
  );
}

type RadioGroupItemProps = {
  className?: string;
  value: string | number;
  children?: React.ReactNode;
  disabled?: boolean;
};

function RadioGroupItem({ className, value, children, disabled }: any) {
  return (
    <Radio
      value={value}
      className={cn(
        "flex items-center justify-center border rounded-full w-5 h-5 text-primary transition-all disabled:opacity-50",
        className
      )}
      disabled={disabled}
    >
      {children}
    </Radio>
  );
}

export { RadioGroup, RadioGroupItem };
