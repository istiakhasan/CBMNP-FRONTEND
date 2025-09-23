"use client";

import * as React from "react";
import { DatePicker } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { cn } from "./utils";


const { RangePicker } = DatePicker;

type CalendarProps = {
  className?: string;
  mode?: "single" | "range";
} & DatePickerProps &
  RangePickerProps;

function Calendar({ className, mode = "single", ...props }: any) {
  if (mode === "range") {
    return (
      <RangePicker
        className={cn("w-full", className)}
        popupClassName="rounded-lg shadow-md"
        {...(props as RangePickerProps)}
      />
    );
  }

  return (
    <DatePicker
      className={cn("w-full", className)}
      popupClassName="rounded-lg shadow-md"
      {...(props as DatePickerProps)}
    />
  );
}

export { Calendar };
