"use client";
import { Modal, Button, message, Typography } from "antd";
import { CopyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;

interface OrderInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  invoiceText: string;
}

export default function OrderInvoiceModal({
  open,
  onClose,
  title = "Order Invoice",
  invoiceText,
}: OrderInvoiceModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invoiceText);
      setCopied(true);
      message.success("Invoice copied! এখন কাস্টমারকে পাঠাতে পারেন।");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error("Copy করতে সমস্যা হয়েছে");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={480}
      footer={[
        <Button key="close" onClick={onClose}>
          বন্ধ করুন
        </Button>,
        <Button
          key="copy"
          type="primary"
          icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy Invoice"}
        </Button>,
      ]}
    >
      <Title level={4} style={{ marginBottom: 16 }}>
        {title}
      </Title>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#fafafa",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: 16,
          fontFamily: "inherit",
          fontSize: 13,
          lineHeight: 1.6,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {invoiceText}
      </pre>
    </Modal>
  );
}