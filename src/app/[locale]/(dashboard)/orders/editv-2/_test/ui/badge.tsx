"use client";

import React from "react";
import { Tag } from "antd";

type BadgeProps = {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children: React.ReactNode;
};

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: "var(--ant-primary-color)",
    color: "#fff",
    border: "none",
  },
  secondary: {
    backgroundColor: "var(--ant-color-bg-container)",
    color: "var(--ant-color-text)",
    border: "none",
  },
  destructive: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--ant-color-text)",
    border: "1px solid var(--ant-color-border)",
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className,
  children,
}) => {
  return (
    <Tag style={variantStyles[variant]} className={className}>
      {children}
    </Tag>
  );
};
