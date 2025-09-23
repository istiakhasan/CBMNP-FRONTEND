"use client";

import * as React from "react";
import { Checkbox as AntCheckbox } from "antd";
import { cn } from "./utils";

function Checkbox({ className, ...props }: any) {
  return (
    <AntCheckbox
      className={cn(
        "rounded-[4px] border shadow-sm transition-all",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Checkbox };
