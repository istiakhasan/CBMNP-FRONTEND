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

export default function OrderDetailsPanelEdit({
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
 

      {/* Order Type & Shipping */}
      <Row  gutter={16}>
        
        <Col xs={24} md={12}>
          <label className="text-[12px]">Order Source *</label>
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
        <Col xs={24} className="mb-4" md={12}>
          <label className="text-[12px]">Order Type</label>
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
          <label className="text-[12px]">Shipping Type</label>
          <Select
            value={orderDetails?.shippingType}
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
        <Col  xs={24} md={12}>
          <label className="text-[12px]">Shipping Method</label> 
          <Select 
            
            placeholder="Select shipping method"
            value={orderDetails?.currier}
            onChange={(value,options) => updateField("currier", options)}
            style={{ width: "100%"}}
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

 

      {/* Delivery Notes */}
      <div style={{ marginTop: 16 }}>
        <label className="text-[12px]">Delivery Notes</label>
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
