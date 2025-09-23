"use client";

import React from "react";
import { Card, Select, Checkbox, Badge, Input, Row, Col, Radio } from "antd";
import {
  TruckOutlined,
  ShopOutlined,
  CreditCardOutlined,
  MessageOutlined,
  PhoneOutlined,
  FacebookOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";

const { Option } = Select;
const { TextArea } = Input;

const orderSources = [
  { value: "Facebook", label: "Facebook", icon: FacebookOutlined },
  { value: "WhatsApp", label: "WhatsApp", icon: MessageOutlined },
  { value: "Phone Call", label: "Phone Call", icon: PhoneOutlined },
  { value: "Telemarketing", label: "Telemarketing", icon: TeamOutlined },
  { value: "Employee", label: "Employee", icon: HomeOutlined },
];

const paymentStatuses = [
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Partial",
    value: "Partial",
  },
  {
    label: "Paid",
    value: "Paid",
  },
];
const paymentMethods = [
  "Cash on Delivery",
  "Bank Transfer",
  "Mobile Banking",
  "Card Payment",
];

interface OrderDetailsPanelProps {
  orderDetails: any;
  onOrderDetailsChange: (details: any) => void;
  selectedCustomer: any | null;
  getTotalAmount: any;
}

export default function OrderDetailsPanel({
  orderDetails,
  onOrderDetailsChange,
  selectedCustomer,
  getTotalAmount,
}: OrderDetailsPanelProps) {
  const { data: deliveryPartner } =
    useGetDeliveryPartnerOptionsQuery(undefined);
  const subtotal = getTotalAmount();
  const shipping = orderDetails.shippingCharge;
  const total = subtotal + shipping;
  const { data: warehouses } = useLoadAllWarehouseOptionsQuery(undefined);
  const updateField = (field: keyof any, value: any) => {
    onOrderDetailsChange((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePaymentMethod = (method: string) => {
    const currentMethods = orderDetails.paymentMethods;
    const updatedMethods = currentMethods.includes(method)
      ? currentMethods.filter((m: any) => m !== method)
      : [...currentMethods, method];

    updateField("paymentMethods", updatedMethods);
  };

  const getShippingInfo = () => {
    if (!orderDetails.deliveryAddress) {
      return {
        message: "Please select a delivery address to see shipping information",
        charge: 0,
        color: "gray",
      };
    }

    const district = orderDetails.deliveryAddress.district;
    if (district === "Dhaka") {
      return {
        message: `Shipping to ${district}: ৳70`,
        charge: 70,
        color: "green",
      };
    } else if (
      [
        "Rajshahi",
        "Barishal",
        "Khulna",
        "Sylhet",
        "Chittagong",
        "Rangpur",
        "Mymensingh",
      ].includes(district || "")
    ) {
      return {
        message: `Shipping to ${district}: ৳120`,
        charge: 120,
        color: "blue",
      };
    } else {
      return {
        message: `Shipping to ${district}: ৳70 (Default rate)`,
        charge: 70,
        color: "orange",
      };
    }
  };

  const shippingInfo = getShippingInfo();

  return (
    <Card
      title={
        <span>
          <TruckOutlined style={{ color: "#722ED1", marginRight: 8 }} />
          Operational Order Details
        </span>
      }
      style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      {/* Warehouse & Order Source */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <label>Warehouse Selection *</label>
          <Select
            value={orderDetails.warehouse}
            labelInValue
            onChange={(value) => updateField("warehouse", value)}
            style={{ width: "100%" }}
            placeholder="Select warehouse"
          >
            {warehouses?.data?.map((w: any, i: any) => (
              <Option key={w.value} value={w.value}>
                <div>
                  <div style={{ fontSize: 12 }}>{w.label}</div>
                </div>
              </Option>
            ))}
          </Select>
          {selectedCustomer && orderDetails.warehouse && (
            <p style={{ fontSize: 12, color: "green", marginTop: 4 }}>
              ✓ Suggested based on customer location:{" "}
              {selectedCustomer?.location?.mapLocation}
            </p>
          )}
        </Col>

        <Col xs={24} md={12}>
          <label>Order Source *</label>
          <Select
            value={orderDetails.orderSource}
            onChange={(value) => updateField("orderSource", value)}
            style={{ width: "100%" }}
            placeholder="Select order source"
          >
            {orderSources.map((source) => {
              const Icon = source.icon;
              return (
                <Option key={source.value} value={source.value}>
                  <Icon style={{ marginRight: 4 }} />
                  {source.label}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>

      {/* Order Type & Shipping */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <label>Order Type</label>
          <Select
            value={orderDetails?.orderType}
            onChange={(value) => updateField("orderType", value)}
            style={{ width: "100%" }}
          >
            {[
              {
                label: "Regular",
                value: "Regular",
              },
              {
                label: "Pre Order",
                value: "Pre Order",
              },
              {
                label: "Exchange",
                value: "Exchange",
              },
              {
                label: "Re-book",
                value: "Re-book",
              },
            ].map((type) => (
              <Option key={type.value} value={type.label}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={12}>
          <label>Shipping Type</label>
          <Select
            value={"Regular"}
            onChange={(value) => updateField("shippingType", value)}
            style={{ width: "100%" }}
          >
            {[
              {
                label: "Regular",
                value: "Regular",
              },
              {
                label: "Express",
                value: "Express",
              },
              // {
              //   label:"Free",
              //   value:"Free",
              // },
            ].map((type) => (
              <Option key={type.value} value={type.value}>
                {type.value}
              </Option>
            ))}
          </Select>
        </Col>
        <Col className="mt-[12px]" xs={24} md={12}>
          <label>Shipping Method</label>
          <Select
            placeholder="Select shipping method"
            value={orderDetails?.currier}
            onChange={(value) => updateField("currier", value)}
            style={{ width: "100%" }}
            options={deliveryPartner?.data}
          />
        </Col>
      </Row>

      {/* Shipping Info */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #f0f0f0",
          borderRadius: 6,
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span>
            <TruckOutlined style={{ color: "#722ED1", marginRight: 4 }} />{" "}
            Shipping Information
          </span>
          {orderDetails.deliveryAddress && (
            <Badge
              count={orderDetails?.deliveryAddress?.label}
              style={{ backgroundColor: "#eee", color: "#555" }}
            />
          )}
        </div>
        <p style={{ color: shippingInfo.color }}>{shippingInfo.message}</p>
        {orderDetails.deliveryAddress && (
          <p style={{ fontSize: 12, color: "#888" }}>
            Delivery to: {orderDetails.deliveryAddress.address}
          </p>
        )}
      </div>

      {/* Payment */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* Payment Status */}
        <Col xs={24} md={12}>
          <label>Payment Status</label>
          <Select
            value={orderDetails.paymentStatus || "Pending"}
            onChange={(value) => {
              // Reset amount when changing status
              updateField("amount", 0);
              updateField("paymentStatus", value);
              if (value === "Pending") {
                updateField("paymentMethod", "Cash on Delivery");
              }
              if (value === "Paid") {
                updateField("amount", total);
                updateField("paymentMethod", undefined);
              }
              if (value === "Partial") {
                updateField("paymentMethod", undefined);
              }

              // Clear transactionId when Pending
              if (value === "Pending") {
                updateField("transactionId", "");
              }
            }}
            style={{ width: "100%" }}
            options={paymentStatuses}
          />

          {/* Show transactionId & amount if status is Partial or Paid */}
          {["Paid", "Partial"].includes(orderDetails.paymentStatus) && (
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col xs={24} md={24}>
                <label>Transaction ID *</label>
                <Input
                  placeholder="Enter transaction ID"
                  value={orderDetails.transactionId || ""}
                  required
                  onChange={(e) => updateField("transactionId", e.target.value)}
                />
              </Col>
              <Col xs={24} md={24}>
                <label>Amount *</label>
                <Input
                  placeholder="Enter Amount"
                  value={orderDetails.amount || ""}
                  required
                  disabled={orderDetails.paymentStatus === "Paid"} // Auto-filled
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      // Prevent amount > total
                      updateField("amount", value > total ? total : value);
                    }
                  }}
                />
              </Col>
            </Row>
          )}
        </Col>

        {/* Payment Methods */}
        <Col xs={24} md={12}>
          <label>Payment Method *</label>
          <Radio.Group
            value={orderDetails.paymentMethod}
            onChange={(e) => updateField("paymentMethod", e.target.value)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 4,
            }}
          >
            {paymentMethods.map((method) => {
              const status = orderDetails.paymentStatus;
              const isPending = status === "Pending";
              const isPaidOrPartial = ["Paid", "Partial"].includes(status);

              // Disable rules
              let disabled = false;
              if (isPending && method !== "Cash on Delivery") disabled = true;
              if (isPaidOrPartial && method === "Cash on Delivery")
                disabled = true;

              return (
                <Radio key={method} value={method} disabled={disabled}>
                  {method}
                </Radio>
              );
            })}
          </Radio.Group>
        </Col>
      </Row>

      {/* Delivery Notes */}
      <div style={{ marginTop: 16 }}>
        <label>Delivery Notes</label>
        <TextArea
          value={orderDetails.deliveryNote}
          onChange={(e) => updateField("deliveryNote", e.target.value)}
          rows={3}
          placeholder="Special delivery instructions, customer preferences, or notes..."
        />
      </div>
    </Card>
  );
}
